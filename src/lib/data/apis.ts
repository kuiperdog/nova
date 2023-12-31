import { JsonRpcProvider } from "ethers";

export namespace Subsquid {
    export const URL = 'https://squid.subsquid.io/cosmo/graphql';

    export const Collection = {
        artists: [] as string[],
        back: '',
//        backgroundColor: '',
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

    export function formatObjekt(collection: Collection, objekt: Objekt | null = null): string {
        return collection.member + ' ' + collection.season.charAt(0) + collection.number.substring(0, 3) + (objekt ? ` #${objekt.serial}` : '');
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

    let _artists: Artist[];
    export async function artists(): Promise<Artist[]> {
        if (_artists)
            return _artists;

        const res = await fetch(`${URL}/artist/v1/`);
        const data = await res.json();
        _artists = data.artists;

        return _artists;
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
    export const RPC = new JsonRpcProvider('https://polygon-rpc.com');
}
