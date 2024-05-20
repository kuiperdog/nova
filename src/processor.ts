import { EvmBatchProcessor, type Log, type Transaction } from '@subsquid/evm-processor';
import { lookupArchive } from '@subsquid/archive-registry';
import { type Store, TypeormDatabase } from '@subsquid/typeorm-store';
import { type Logger } from '@subsquid/logger';
import { JsonRpcProvider } from 'ethers';
import * as objektContract from './abi/Objekt';
import * as governorContract from './abi/Governor';
import * as comoContract from './abi/ERC20';

let env: { [key: string]: string | undefined };
export async function loadEnv() {
    try {
        env = (await import('$env/dynamic/public')).env;
    } catch {
        require('dotenv').config();
        env = process.env;
    }
}

export let contracts: any;
export async function run(
    startBlock: number,
    archive: boolean,
    processObjektTransfer: (log: Log, store: Store, logger: Logger) => Promise<void> = async () => {},
    processComoTransfer: (log: Log, store: Store, logger: Logger) => Promise<void> = async () => {},
    processVote: (log: Log, store: Store, logger: Logger) => Promise<void> = async () => {},
    processTransferabilityUpdate: (txn: Transaction & {input: string}, store: Store, logger: Logger) => Promise<void> = async () => {},
    processReveal: (txn: Transaction & {input: string}, store: Store, logger: Logger) => Promise<void> = async () => {},
    processBatch: (store: Store, logger: Logger) => Promise<void> = async () => {}
) {
    if (!env)
        await loadEnv();

    const res = await fetch(`${env.__COSMO_API__}/artist/v1`);
    const artists = await res.json();
    contracts = artists.artists.reduce((acc: any, artist: any) => {
        Object.keys(artist.contracts).forEach(key => {
            acc[key] = [...(acc[key] || []), artist.contracts[key].toLowerCase()];
        });
        return acc;
    }, {});

    const processor = new EvmBatchProcessor()
        .setRpcEndpoint(env.__POLYGON_RPC__)
        .setFinalityConfirmation(300)
        .setBlockRange({ from: startBlock })
        .setFields({ evmLog: { topics: true, data: true }, transaction: { sighash: true, input: true } })
        .addLog({ address: contracts.Objekt, topic0: [ objektContract.events.Transfer.topic ] })
        .addLog({ address: contracts.Como, topic0: [ comoContract.events.Transfer.topic ] })
        .addLog({ address: contracts.Governor, topic0: [ governorContract.events.Voted.topic ] })
        .addTransaction({ to: contracts.Objekt, sighash: [ objektContract.functions.batchUpdateObjektTransferrability.sighash ] })
        .addTransaction({ to: contracts.Governor, sighash: [ governorContract.functions.reveal.sighash ]});
    
    let database;
    if (archive) {
        processor.setGateway(lookupArchive('polygon'));
        database = new TypeormDatabase({ supportHotBlocks: true });
    } else {
        const provider = new JsonRpcProvider(env.__POLYGON_RPC__);
        const blockData = await provider.getBlock(startBlock);
        database = {
            connect: async () => { return { height: startBlock, hash: blockData?.hash! } },
            transact: async (info: any, cb: (store: Store) => Promise<void>) => {}
        };
    }

    processor.run(database, async (ctx) => {
        for (let block of ctx.blocks) {
            for (let log of block.logs) {
                switch (log.topics[0]) {
                    case objektContract.events.Transfer.topic:
                        if (contracts.Objekt.includes(log.address))
                            await processObjektTransfer(log, ctx.store, ctx.log);
                        if (contracts.Como.includes(log.address))
                            await processComoTransfer(log, ctx.store, ctx.log);
                        break;
                    case governorContract.events.Voted.topic:
                        if (contracts.Governor.includes(log.address))
                            await processVote(log, ctx.store, ctx.log);
                        break;
                    default:
                        break;
                }
            }
    
            for (let transaction of block.transactions) {
                switch (transaction.sighash) {
                    case objektContract.functions.batchUpdateObjektTransferrability.sighash:
                        if (contracts.Objekt.includes(transaction.to))
                            await processTransferabilityUpdate(transaction, ctx.store, ctx.log);
                        break;
                    case governorContract.functions.reveal.sighash:
                        if (contracts.Governor.includes(transaction.to))
                            await processReveal(transaction, ctx.store, ctx.log);
                        break;
                    default:
                        break;
                }
            }
        }

        await processBatch(ctx.store, ctx.log);
    });
}
