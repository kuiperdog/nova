import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './Objekt.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    Approval: new LogEvent<([owner: string, approved: string, tokenId: bigint] & {owner: string, approved: string, tokenId: bigint})>(
        abi, '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'
    ),
    ApprovalForAll: new LogEvent<([owner: string, operator: string, approved: boolean] & {owner: string, operator: string, approved: boolean})>(
        abi, '0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31'
    ),
    Initialized: new LogEvent<([version: number] & {version: number})>(
        abi, '0x7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498'
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
    Transfer: new LogEvent<([from: string, to: string, tokenId: bigint] & {from: string, to: string, tokenId: bigint})>(
        abi, '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
    ),
}

export const functions = {
    DEFAULT_ADMIN_ROLE: new Func<[], {}, string>(
        abi, '0xa217fddf'
    ),
    MINTER_ROLE: new Func<[], {}, string>(
        abi, '0xd5391393'
    ),
    TRANSFERRER_ROLE: new Func<[], {}, string>(
        abi, '0x63ac5d97'
    ),
    approvalWhitelists: new Func<[_: string], {}, boolean>(
        abi, '0x419e583d'
    ),
    approve: new Func<[to: string, tokenId: bigint], {to: string, tokenId: bigint}, []>(
        abi, '0x095ea7b3'
    ),
    balanceOf: new Func<[owner: string], {owner: string}, bigint>(
        abi, '0x70a08231'
    ),
    batchUpdateObjektTransferrability: new Func<[tokenIds: Array<bigint>, transferrable: boolean], {tokenIds: Array<bigint>, transferrable: boolean}, []>(
        abi, '0x85d928f0'
    ),
    blacklists: new Func<[_: string], {}, boolean>(
        abi, '0x16c02129'
    ),
    burn: new Func<[tokenId: bigint], {tokenId: bigint}, []>(
        abi, '0x42966c68'
    ),
    getApproved: new Func<[tokenId: bigint], {tokenId: bigint}, string>(
        abi, '0x081812fc'
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
    initialize: new Func<[baseURI_: string], {baseURI_: string}, []>(
        abi, '0xf62d1888'
    ),
    isApprovedForAll: new Func<[owner: string, operator: string], {owner: string, operator: string}, boolean>(
        abi, '0xe985e9c5'
    ),
    isObjektTransferrable: new Func<[_: bigint], {}, boolean>(
        abi, '0xa8085d01'
    ),
    mint: new Func<[to: string, tokenId: bigint, transferrable: boolean], {to: string, tokenId: bigint, transferrable: boolean}, []>(
        abi, '0xd1a1beb4'
    ),
    mintBatch: new Func<[to: string, startTokenId: bigint, endTokenId: bigint, transferrable: boolean], {to: string, startTokenId: bigint, endTokenId: bigint, transferrable: boolean}, []>(
        abi, '0x71c87f29'
    ),
    name: new Func<[], {}, string>(
        abi, '0x06fdde03'
    ),
    ownerOf: new Func<[tokenId: bigint], {tokenId: bigint}, string>(
        abi, '0x6352211e'
    ),
    renounceRole: new Func<[role: string, account: string], {role: string, account: string}, []>(
        abi, '0x36568abe'
    ),
    revokeRole: new Func<[role: string, account: string], {role: string, account: string}, []>(
        abi, '0xd547741f'
    ),
    'safeTransferFrom(address,address,uint256)': new Func<[from: string, to: string, tokenId: bigint], {from: string, to: string, tokenId: bigint}, []>(
        abi, '0x42842e0e'
    ),
    'safeTransferFrom(address,address,uint256,bytes)': new Func<[from: string, to: string, tokenId: bigint, _data: string], {from: string, to: string, tokenId: bigint, _data: string}, []>(
        abi, '0xb88d4fde'
    ),
    setApprovalForAll: new Func<[operator: string, approved: boolean], {operator: string, approved: boolean}, []>(
        abi, '0xa22cb465'
    ),
    setApprovalWhitelist: new Func<[addr: string, isWhitelisted: boolean], {addr: string, isWhitelisted: boolean}, []>(
        abi, '0xca0429e0'
    ),
    setBaseURI: new Func<[_newBaseURI: string], {_newBaseURI: string}, []>(
        abi, '0x55f804b3'
    ),
    setBlacklist: new Func<[addr: string, isBlacklisted: boolean], {addr: string, isBlacklisted: boolean}, []>(
        abi, '0x153b0d1e'
    ),
    supportsInterface: new Func<[interfaceId: string], {interfaceId: string}, boolean>(
        abi, '0x01ffc9a7'
    ),
    symbol: new Func<[], {}, string>(
        abi, '0x95d89b41'
    ),
    tokenByIndex: new Func<[index: bigint], {index: bigint}, bigint>(
        abi, '0x4f6ccce7'
    ),
    tokenOfOwnerByIndex: new Func<[owner: string, index: bigint], {owner: string, index: bigint}, bigint>(
        abi, '0x2f745c59'
    ),
    tokenURI: new Func<[tokenId: bigint], {tokenId: bigint}, string>(
        abi, '0xc87b56dd'
    ),
    totalSupply: new Func<[], {}, bigint>(
        abi, '0x18160ddd'
    ),
    transferFrom: new Func<[from: string, to: string, tokenId: bigint], {from: string, to: string, tokenId: bigint}, []>(
        abi, '0x23b872dd'
    ),
}

export class Contract extends ContractBase {

    DEFAULT_ADMIN_ROLE(): Promise<string> {
        return this.eth_call(functions.DEFAULT_ADMIN_ROLE, [])
    }

    MINTER_ROLE(): Promise<string> {
        return this.eth_call(functions.MINTER_ROLE, [])
    }

    TRANSFERRER_ROLE(): Promise<string> {
        return this.eth_call(functions.TRANSFERRER_ROLE, [])
    }

    approvalWhitelists(arg0: string): Promise<boolean> {
        return this.eth_call(functions.approvalWhitelists, [arg0])
    }

    balanceOf(owner: string): Promise<bigint> {
        return this.eth_call(functions.balanceOf, [owner])
    }

    blacklists(arg0: string): Promise<boolean> {
        return this.eth_call(functions.blacklists, [arg0])
    }

    getApproved(tokenId: bigint): Promise<string> {
        return this.eth_call(functions.getApproved, [tokenId])
    }

    getRoleAdmin(role: string): Promise<string> {
        return this.eth_call(functions.getRoleAdmin, [role])
    }

    hasRole(role: string, account: string): Promise<boolean> {
        return this.eth_call(functions.hasRole, [role, account])
    }

    isApprovedForAll(owner: string, operator: string): Promise<boolean> {
        return this.eth_call(functions.isApprovedForAll, [owner, operator])
    }

    isObjektTransferrable(arg0: bigint): Promise<boolean> {
        return this.eth_call(functions.isObjektTransferrable, [arg0])
    }

    name(): Promise<string> {
        return this.eth_call(functions.name, [])
    }

    ownerOf(tokenId: bigint): Promise<string> {
        return this.eth_call(functions.ownerOf, [tokenId])
    }

    supportsInterface(interfaceId: string): Promise<boolean> {
        return this.eth_call(functions.supportsInterface, [interfaceId])
    }

    symbol(): Promise<string> {
        return this.eth_call(functions.symbol, [])
    }

    tokenByIndex(index: bigint): Promise<bigint> {
        return this.eth_call(functions.tokenByIndex, [index])
    }

    tokenOfOwnerByIndex(owner: string, index: bigint): Promise<bigint> {
        return this.eth_call(functions.tokenOfOwnerByIndex, [owner, index])
    }

    tokenURI(tokenId: bigint): Promise<string> {
        return this.eth_call(functions.tokenURI, [tokenId])
    }

    totalSupply(): Promise<bigint> {
        return this.eth_call(functions.totalSupply, [])
    }
}
