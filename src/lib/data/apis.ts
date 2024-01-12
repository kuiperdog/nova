import { JsonRpcProvider } from "ethers";
import governorAbi from './abi/Governor.json';

let _artists: Cosmo.Artist[];

export namespace Subsquid {
    export const URL = 'https://squid.subsquid.io/cosmo/graphql';

    export const Collection = {
        artists: [] as string[],
        back: '',
        backgroundColor: '',
        class: '',
        front: '',
        id: '',
        member: '',
        number: '',
        season: '',
        textColor: '',
        thumbnail: '',
        timestamp: 0
    };
    export type Collection = typeof Collection;

    export const Objekt = {
        id: '',
        minted: 0,
        owner: '',
        received: 0,
        serial: 0,
        transferrable: false
    };
    export type Objekt = typeof Objekt;

    export const Transfer = {
        id: '',
        from: '',
        to: '',
        timestamp: 0
    };
    export type Transfer = typeof Transfer;

    export const Como = {
        id: '',
        balance: 0,
        owner: '',
        contract: ''
    };
    export type Como = typeof Como;

    export const Vote = {
        id: '',
        contract: '',
        poll: 0,
        from: '',
        amount: 0,
        index: 0,
        candidate: 0 as number | null,
        timestamp: 0
    };
    export type Vote = typeof Vote;

    export function formatObjekt(collection: Collection, objekt: Objekt | null = null): string {
        return collection.member + ' ' + collection.season.charAt(0) + collection.number.substring(0, 3) + (objekt ? ` #${objekt.serial}` : '');
    }

    export function filterCollections(collections: Collection[], params: URLSearchParams): Collection[] {
        if (params.has('sort')) {
            if (params.get('sort') === 'number')
                collections = collections.sort((a, b) => a.number.localeCompare(b.number));
            else if (params.get('sort') === 'oldest')
                collections = collections.reverse();
        }

        params.forEach((value, key) => {
            switch (key) {
                case 'artist':
                    if (_artists.find(a => a.name === value))
                        collections = collections.filter(c => c.artists.includes(value));
                    else if (_artists.find(a => a.members.find(m => m.name === value)))
                        collections = collections.filter(c => c.member === value);
                    else if (Cosmo.unit(value))
                        collections = collections.filter(c => Cosmo.unit(value)?.includes(c.member));
                    break;
                case 'season':
                    collections = collections.filter(c => c.season === value);
                    break;
                case 'class':
                    collections = collections.filter(c => c.class === value);
                    break;
                case 'number':
                    collections = collections.filter(c => c.number.startsWith(value));
                    break;
                case 'minNumber':
                    collections = collections.filter(c => c.number >= value);
                    break;
                case 'maxNumber':
                    collections = collections.filter(c => c.member <= value);
                    break;
                case 'type':
                    collections = collections.filter(c => c.number.endsWith(value));
                    break;
            }
        });

        return collections;
    }
}

export namespace Cosmo {
    export const URL = 'https://cache.nova.gd';

    export interface Artist {
        name: string;
        title: string;
        logoImageUrl: string;
        contracts: {
            Como: string;
            Objekt: string;
            ObjektMinter: string;
            Governor: string;
            CommunityPool: String;
            ComoMinter: string;
        };
        members: {
            name: string;
            artist: string;
            units?: string[];
            alias?: string;
            profileImageUrl: string;
            mainObjektImageUrl: string;
            order: number;
        }[];
    };

    export interface User {
        nickname: string;
        address: string;
        profileImageUrl: string;
    }

    export interface Gravity {
        id: number;
        artist: string;
        title: string;
        description: string;
        type: string;
        pollType: string;
        bannerImageUrl: string;
        entireStartDate: string;
        entireEndDate: string;
        body: any[];
        polls: Poll[];
        contractOutlink: string;
    }

    export interface Poll {
        id: number;
        artist: string;
        pollIdOnChain: number;
        gravityId: number;
        type: string;
        indexInGravity: number;
        title: string;
        imageUrl: string;
        startDate: string;
        endDate: string;
        revealDate: string;
        finalized: boolean;
    };

    export interface PollDetail extends Poll {
        pollViewMetadata: {
            title: string;
            background: string | null;
            defaultContent?: any;
            selectedContent?: {
                choiceId: string;
                content: any;
            }[];
            slots?: {
                id: string;
                name: string;
                title: string;
                description: string;
                backgroundImageUrl: string;
            }[];
            slotChoices?: {
                id: string;
                name: string;
                alias: string | undefined;
                roundImageUrl: string | null;
                slotCardImageUrl: string | null;
            }[];
            choiceIdToSlotChoicesMapTable?: {
                choiceId: string;
                slotIds: string[];
                slotChoiceIds: string[];
            }[];
        };
        choices: {
            id: string;
            title: string;
            description: string;
            txImageUrl: string;
        }[];
    };

    let artistsPromise: Promise<Artist[]>;
    export async function artists(): Promise<Artist[]> {
        if (_artists)
            return _artists;

        if (!artistsPromise) {
            artistsPromise = (async () => {
                const res = await fetch(`${URL}/artist/v1/`);
                const data = await res.json();
                _artists = data.artists;
                return _artists;
            })();
        }

        return artistsPromise;
    }

    export function unit(name: string): string[] | undefined {
        for (const artist of _artists) {
            const members = artist.members.filter(m => m.units && m.units.includes(name));
            if (members.length)
                return members.map(m => m.name);
        }
        return undefined;
    }
}

export namespace Polygon {
    export const RPC = new JsonRpcProvider('https://rpc.ankr.com/polygon');
    export const ABI = {
        Governor: governorAbi
    };
}
