import { run, contracts } from '../processor';
import * as objektContract from '../abi/Objekt';
import * as governorContract from '../abi/Governor';
import * as comoContract from '../abi/ERC20';
import { Collection, Objekt, Transfer, Vote, Como } from '../model';
import { type Log, type Transaction, } from '@subsquid/evm-processor';
import { type Entity, Store } from '@subsquid/typeorm-store';
import { Logger } from '@subsquid/logger';
import axios, { type AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import { ZeroAddress } from 'ethers';

require('dotenv').config();

const entities = new Map<string, Entity[]>();
const client = axios.create({
    validateStatus: (status) => { return (status >= 200 && status < 300) || status == 404 }
});
axiosRetry(client);

async function processObjektTransfer(log: Log, store: Store, logger: Logger) {
    const event = objektContract.events.Transfer.decode(log);
    const token = event.tokenId.toString();

    logger.info(`Processing Objekt transfer from ${event.from} to ${event.to} of ID ${token}`);

    if (!entities.has(Objekt.name))
        entities.set(Objekt.name, []);

    const objekt = entities.get(Objekt.name)?.find(i => i.id === token) as Objekt
        || await store.get(Objekt, token)
        || new Objekt({ id: token, minted: BigInt(log.block.timestamp) });

    objekt.owner = event.to;
    objekt.received = BigInt(log.block.timestamp);
    
    if (!entities.get(Objekt.name)?.find(i => i.id === token))
        entities.get(Objekt.name)?.push(objekt);

    const transfer = new Transfer({
        id: log.id,
        objekt: objekt,
        to: event.to,
        from: event.from,
        timestamp: BigInt(log.block.timestamp)
    });

    if (entities.has(Transfer.name))
        entities.get(Transfer.name)?.push(transfer);
    else
        entities.set(Transfer.name, [transfer]);
}

async function processComoTransfer(log: Log, store: Store, logger: Logger) {
    const event = comoContract.events.Transfer.decode(log);

    logger.info(`Processing Como transfer from ${event.from} to ${event.to}`);

    if (!entities.has(Como.name))
        entities.set(Como.name, []);

    const nonUserAddresses = [
        ZeroAddress,
        '0xD5fc87DD8494d6B657bF0DE20111235d983CEC84',
        ...contracts.Governor,
        ...contracts.CommunityPool
    ];
    
    if (!nonUserAddresses.includes(event.from.toLowerCase())) {
        let entry = entities.get(Como.name)?.find(c => (c as Como).contract === log.address && (c as Como).owner === event.from) as Como | undefined;

        if (entry) {
            entry.balance = BigInt(Math.max(0, Number(entry.balance - event.value)));
        } else {
            entry = await store.findOneBy(Como, { contract: log.address, owner: event.from });

            if (entry) {
                entry.balance = BigInt(Math.max(0, Number(entry.balance - event.value)));
                entities.get(Como.name)?.push(entry);
            } else { 
                entities.get(Como.name)?.push(new Como({
                    id: log.id,
                    contract: log.address,
                    owner: event.from,
                    balance: BigInt(0)
                }));
            }
        }
    }

    if (!nonUserAddresses.includes(event.to.toLowerCase())) {
        let entry = entities.get(Como.name)?.find(c => (c as Como).contract === log.address && (c as Como).owner === event.to) as Como | undefined;

        if (entry) {
            entry.balance = entry.balance + event.value;
        } else {
            entry = await store.findOneBy(Como, { contract: log.address, owner: event.to });

            if (entry) {
                entry.balance = entry.balance + event.value;
                entities.get(Como.name)?.push(entry);
            } else { 
                entities.get(Como.name)?.push(new Como({
                    id: log.id,
                    contract: log.address,
                    owner: event.to,
                    balance: event.value
                }));
            }
        }
    }
}

async function processVote(log: Log, _: Store, logger: Logger) {
    const event = governorContract.events.Voted.decode(log);

    logger.info(`Processing vote from ${event.voter} to ${log.address}`);

    const vote = new Vote({
        id: log.id,
        from: event.voter,
        contract: log.address,
        poll: event.pollId,
        index: event.voteIndex,
        amount: event.comoAmount,
        timestamp: BigInt(log.block.timestamp)
    });

    if (entities.has(Vote.name))
        entities.get(Vote.name)?.push(vote);
    else
        entities.set(Vote.name, [vote]);
}

async function processTransferabilityUpdate(txn: Transaction & {input: string}, store: Store, logger: Logger) {
    const method = objektContract.functions.batchUpdateObjektTransferrability.decode(txn.input);

    logger.info(`Updating transferability of ${method.tokenIds.length} Objekts`);

    if (!entities.has(Objekt.name))
        entities.set(Objekt.name, []);
    
    for (let token of method.tokenIds) {
        let objekt = entities.get(Objekt.name)?.find(o => o.id === Number(token).toString()) as Objekt | undefined;
        if (objekt) {
            objekt.transferrable = method.transferrable;
        } else {
            objekt = await store.get(Objekt, Number(token).toString());
            if (objekt) {
                objekt.transferrable = method.transferrable;
                entities.get(Objekt.name)?.push(objekt);
            }
        }
    }
}

async function processReveal(txn: Transaction & {input: string}, store: Store, logger: Logger) {
    const method = governorContract.functions.reveal.decode(txn.input);

    logger.info(`Revealing ${method.data.length} votes`);

    if (!entities.has(Vote.name))
        entities.set(Vote.name, []);

    for (let i = 0; i < method.data.length; i++) {
        let vote = entities.get(Vote.name)?.find(v =>
            (v as Vote).contract === txn.to &&
            (v as Vote).index === method.offset + BigInt(i) &&
            (v as Vote).poll === method.pollId
        ) as Vote | undefined;

        if (vote) {
            vote.candidate = Number(method.data[i].votedCandidateId);
        } else {
            vote = await store.findOneBy(Vote, {
                contract: txn.to,
                index: method.offset + BigInt(i),
                poll: method.pollId
            });
            if (vote) {
                vote.candidate = Number(method.data[i].votedCandidateId);
                entities.get(Vote.name)?.push(vote);
            }
        }
    }
}

async function processBatch(store: Store, log: Logger) {
    const MAX_REQUESTS = 500;

    const unpopulated = (entities.get(Objekt.name) || []).filter(o => !(o as Objekt).collection);
    if (unpopulated.length) {
        log.info(`Populating metadata of ${unpopulated.length} Objekts`);

        for (let r = 0; r < unpopulated.length; r += MAX_REQUESTS) {
            const batch = unpopulated.slice(r, r + MAX_REQUESTS);

            const requests: AxiosResponse[] = [];
            requests.push(...await Promise.all(batch.map(o => {
                return client.get(`${process.env.__COSMO_API__}/objekt/v1/token/${o.id}`);
            })));

            for (let i = 0; i < requests.length; i++) {
                if (requests[i].status === 404 || !requests[i].data || !requests[i].data.objekt) {
                    log.warn(`Failed to fetch metadata for Objekt of ID ${batch[i].id}`);
                    continue;
                }

                const metadata = requests[i].data.objekt;
                const collectionId = metadata.collectionId.toLowerCase().replaceAll(' ', '-');

                let collection: Collection | undefined;
                
                if (entities.has(Collection.name))
                    collection = entities.get(Collection.name)?.find(c => c.id === collectionId) as Collection;
                if (!collection)
                    collection = await store.get(Collection, collectionId);

                if (!collection) {
                    collection = new Collection({
                        id: collectionId,
                        artists: metadata.artists,
                        member: metadata.member,
                        season: metadata.season,
                        class: metadata.class,
                        number: metadata.collectionNo,
                        thumbnail: metadata.thumbnailImage,
                        front: metadata.frontImage,
                        back: metadata.backImage,
                        textColor: metadata.textColor,
                        backgroundColor: metadata.backgroundColor,
                        timestamp: (entities.get(Transfer.name)?.find(t => (t as Transfer).objekt.id === batch[i].id) as Transfer).timestamp
                    })
                    if (entities.has(Collection.name))
                        entities.get(Collection.name)?.push(collection);
                    else
                        entities.set(Collection.name, [collection]);
                }

                const objekt = new Objekt({
                    ...batch[i],
                    collection: collection,
                    serial: metadata.objektNo,
                    transferrable: metadata.transferable
                });

                const transfers = entities.get(Transfer.name)?.filter(t => (t as Transfer).objekt.id === batch[i].id) as Transfer[] | undefined;
                if (transfers) {
                    for (const transfer of transfers)
                        transfer.objekt = objekt;
                }
                
                entities.get(Objekt.name)![entities.get(Objekt.name)?.findIndex(o => o.id === batch[i].id)!] = objekt;
            }

            log.info(`Batch ${Math.floor(r / MAX_REQUESTS) + 1} completed`);
        }
    }

    const hierarchy = [ Collection.name, Objekt.name, Transfer.name ];
    for (let key of new Set([ ...hierarchy, ...entities.keys() ])) {
        if (!entities.has(key) || !entities.get(key)!.length)
            continue;

        const data = entities.get(key)!;
        await store.save(data);

        if (data.length > 1)
            log.info(`Saved ${data.length} entities of type "${key}"`);
        else
            log.info(`Saved 1 ${key} entity with ID "${data[0].id}"`);
    }
    entities.clear();
}

run(
    31385244,
    true,
    processObjektTransfer,
    processComoTransfer,
    processVote,
    processTransferabilityUpdate,
    processReveal,
    processBatch
);
