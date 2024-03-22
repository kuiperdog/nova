import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './Governor.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    Finalized: new LogEvent<([pollId: bigint, burned: bigint] & {pollId: bigint, burned: bigint})>(
        abi, '0xb968440accd1ce5fa60b00de8bb8d8487eb2fda3c3701fb30fea3f69aa910a48'
    ),
    Initialized: new LogEvent<([version: number] & {version: number})>(
        abi, '0x7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498'
    ),
    PollCreated: new LogEvent<([pollId: bigint] & {pollId: bigint})>(
        abi, '0xab0309b6731a34e8750174d3c2c9591a34a2bf0c1425a30b34122be08d050739'
    ),
    Revealed: new LogEvent<([pollId: bigint, revealedVotes: bigint, remainingVotes: bigint] & {pollId: bigint, revealedVotes: bigint, remainingVotes: bigint})>(
        abi, '0x7162321ecace9c982905ec8d8000eb292887b6befedc98e18dbb27fa95e752d7'
    ),
    RoleAdminChanged: new LogEvent<([role: string, previousAdminRole: string, newAdminRole: string] & {role: string, previousAdminRole: string, newAdminRole: string})>(
        abi, '0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff'
    ),
    RoleGranted: new LogEvent<([role: string, account: string, sender: string] & {role: string, account: string, sender: string})>(
        abi, '0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d'
    ),
    RoleRevoked: new LogEvent<([role: string, account: string, sender: string] & {role: string, account: string, sender: string})>(
        abi, '0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b'
    ),
    Voted: new LogEvent<([pollId: bigint, voteIndex: bigint, voter: string, comoAmount: bigint, hash: string] & {pollId: bigint, voteIndex: bigint, voter: string, comoAmount: bigint, hash: string})>(
        abi, '0x0f066129e5902e103e22209fff5d12a79f07dc9ef7c78fe10ff64c741a20c8ec'
    ),
}

export const functions = {
    DEFAULT_ADMIN_ROLE: new Func<[], {}, string>(
        abi, '0xa217fddf'
    ),
    OPERATOR_ROLE: new Func<[], {}, string>(
        abi, '0xf5b541a6'
    ),
    candidates: new Func<[pollId: bigint], {pollId: bigint}, Array<string>>(
        abi, '0x3477ee2e'
    ),
    comoContract: new Func<[], {}, string>(
        abi, '0xabfecc48'
    ),
    createPoll: new Func<[title_: string, candidates_: Array<string>, startAt_: bigint, due_: bigint, minimumCOMO_: bigint], {title_: string, candidates_: Array<string>, startAt_: bigint, due_: bigint, minimumCOMO_: bigint}, []>(
        abi, '0x4b117094'
    ),
    finalize: new Func<[pollId: bigint], {pollId: bigint}, []>(
        abi, '0x05261aea'
    ),
    getRoleAdmin: new Func<[role: string], {role: string}, string>(
        abi, '0x248a9ca3'
    ),
    grantRole: new Func<[role: string, account: string], {role: string, account: string}, []>(
        abi, '0x2f2ff15d'
    ),
    hasRole: new Func<[role: string, account: string], {role: string, account: string}, boolean>(
        abi, '0x91d14854'
    ),
    hashes: new Func<[_: bigint, _: string], {}, boolean>(
        abi, '0xe28f80ce'
    ),
    initialize: new Func<[voteSignerAddress_: string, comoAddress_: string], {voteSignerAddress_: string, comoAddress_: string}, []>(
        abi, '0x485cc955'
    ),
    isInProgress: new Func<[pollId: bigint], {pollId: bigint}, boolean>(
        abi, '0x1728fad1'
    ),
    isRevealedVote: new Func<[_: bigint, _: bigint], {}, boolean>(
        abi, '0xe4490ce2'
    ),
    pollResult: new Func<[pollId: bigint], {pollId: bigint}, Array<([candidate: string, votes: bigint] & {candidate: string, votes: bigint})>>(
        abi, '0xa9448999'
    ),
    polls: new Func<[_: bigint], {}, ([title: string, startAt: bigint, due: bigint, minimumCOMO: bigint, totalVotedCOMO: bigint, revealedVotes: bigint, finalized: boolean] & {title: string, startAt: bigint, due: bigint, minimumCOMO: bigint, totalVotedCOMO: bigint, revealedVotes: bigint, finalized: boolean})>(
        abi, '0xac2f0074'
    ),
    remainingVotes: new Func<[pollId: bigint], {pollId: bigint}, bigint>(
        abi, '0x034970ca'
    ),
    renounceRole: new Func<[role: string, account: string], {role: string, account: string}, []>(
        abi, '0x36568abe'
    ),
    reset: new Func<[pollId: bigint, missingOffset: bigint, missingCommitData: Array<([comoAmount: bigint, hash: string] & {comoAmount: bigint, hash: string})>], {pollId: bigint, missingOffset: bigint, missingCommitData: Array<([comoAmount: bigint, hash: string] & {comoAmount: bigint, hash: string})>}, []>(
        abi, '0x8e6a8233'
    ),
    reveal: new Func<[pollId: bigint, data: Array<([votedCandidateId: bigint, salt: string] & {votedCandidateId: bigint, salt: string})>, offset: bigint], {pollId: bigint, data: Array<([votedCandidateId: bigint, salt: string] & {votedCandidateId: bigint, salt: string})>, offset: bigint}, []>(
        abi, '0x0f9acac6'
    ),
    revokeRole: new Func<[role: string, account: string], {role: string, account: string}, []>(
        abi, '0xd547741f'
    ),
    setVoteSignerAddress: new Func<[addr: string], {addr: string}, []>(
        abi, '0xf7729a2c'
    ),
    supportsInterface: new Func<[interfaceId: string], {interfaceId: string}, boolean>(
        abi, '0x01ffc9a7'
    ),
    tokensReceived: new Func<[operator: string, from: string, to: string, amount: bigint, userData: string, operatorData: string], {operator: string, from: string, to: string, amount: bigint, userData: string, operatorData: string}, []>(
        abi, '0x0023de29'
    ),
    totalVotes: new Func<[pollId: bigint], {pollId: bigint}, bigint>(
        abi, '0x19e6e158'
    ),
    userVoteResults: new Func<[_: bigint, _: string, _: bigint], {}, bigint>(
        abi, '0xbdd98d0a'
    ),
    voteSignerAddress: new Func<[], {}, string>(
        abi, '0x525e70f6'
    ),
    voters: new Func<[_: bigint, _: bigint], {}, string>(
        abi, '0xfba00cbd'
    ),
    votes: new Func<[pollId: bigint], {pollId: bigint}, Array<([comoAmount: bigint, hash: string] & {comoAmount: bigint, hash: string})>>(
        abi, '0x5df81330'
    ),
    votesPerCandidates: new Func<[pollId: bigint], {pollId: bigint}, Array<bigint>>(
        abi, '0x48267186'
    ),
}

export class Contract extends ContractBase {

    DEFAULT_ADMIN_ROLE(): Promise<string> {
        return this.eth_call(functions.DEFAULT_ADMIN_ROLE, [])
    }

    OPERATOR_ROLE(): Promise<string> {
        return this.eth_call(functions.OPERATOR_ROLE, [])
    }

    candidates(pollId: bigint): Promise<Array<string>> {
        return this.eth_call(functions.candidates, [pollId])
    }

    comoContract(): Promise<string> {
        return this.eth_call(functions.comoContract, [])
    }

    getRoleAdmin(role: string): Promise<string> {
        return this.eth_call(functions.getRoleAdmin, [role])
    }

    hasRole(role: string, account: string): Promise<boolean> {
        return this.eth_call(functions.hasRole, [role, account])
    }

    hashes(arg0: bigint, arg1: string): Promise<boolean> {
        return this.eth_call(functions.hashes, [arg0, arg1])
    }

    isInProgress(pollId: bigint): Promise<boolean> {
        return this.eth_call(functions.isInProgress, [pollId])
    }

    isRevealedVote(arg0: bigint, arg1: bigint): Promise<boolean> {
        return this.eth_call(functions.isRevealedVote, [arg0, arg1])
    }

    pollResult(pollId: bigint): Promise<Array<([candidate: string, votes: bigint] & {candidate: string, votes: bigint})>> {
        return this.eth_call(functions.pollResult, [pollId])
    }

    polls(arg0: bigint): Promise<([title: string, startAt: bigint, due: bigint, minimumCOMO: bigint, totalVotedCOMO: bigint, revealedVotes: bigint, finalized: boolean] & {title: string, startAt: bigint, due: bigint, minimumCOMO: bigint, totalVotedCOMO: bigint, revealedVotes: bigint, finalized: boolean})> {
        return this.eth_call(functions.polls, [arg0])
    }

    remainingVotes(pollId: bigint): Promise<bigint> {
        return this.eth_call(functions.remainingVotes, [pollId])
    }

    supportsInterface(interfaceId: string): Promise<boolean> {
        return this.eth_call(functions.supportsInterface, [interfaceId])
    }

    totalVotes(pollId: bigint): Promise<bigint> {
        return this.eth_call(functions.totalVotes, [pollId])
    }

    userVoteResults(arg0: bigint, arg1: string, arg2: bigint): Promise<bigint> {
        return this.eth_call(functions.userVoteResults, [arg0, arg1, arg2])
    }

    voteSignerAddress(): Promise<string> {
        return this.eth_call(functions.voteSignerAddress, [])
    }

    voters(arg0: bigint, arg1: bigint): Promise<string> {
        return this.eth_call(functions.voters, [arg0, arg1])
    }

    votes(pollId: bigint): Promise<Array<([comoAmount: bigint, hash: string] & {comoAmount: bigint, hash: string})>> {
        return this.eth_call(functions.votes, [pollId])
    }

    votesPerCandidates(pollId: bigint): Promise<Array<bigint>> {
        return this.eth_call(functions.votesPerCandidates, [pollId])
    }
}
