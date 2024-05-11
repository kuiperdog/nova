import artms_logo from "$lib/assets/images/artms_logo.svg";
import tripleS_logo from "$lib/assets/images/tripleS_logo.svg";
import artms_como from "$lib/assets/images/artms_como.svg";
import tripleS_como from "$lib/assets/images/tripleS_como.svg";

interface ArtistAssets {
    logo: string;
    como: string;
};

let _artists: Cosmo.Artist[];
let artistsPromise: Promise<Cosmo.Artist[]>;

export async function getArtists(): Promise<Cosmo.Artist[]> {
    if (_artists)
        return _artists;

    if (!artistsPromise) {
        artistsPromise = (async () => {
            const res = await fetch(`${__COSMO_PROXY__}/artist/v1/`);
            const data = await res.json();
            _artists = data.artists;
            return _artists;
        })();
    }

    return artistsPromise;
}

export function getUnit(name: string): string[] | undefined {
    for (const artist of _artists) {
        const members = artist.members.filter(m => m.units && m.units.includes(name));
        if (members.length)
            return members.map(m => m.name);
    }

    return undefined;
}

export function getAssets(artist: Cosmo.Artist): ArtistAssets {
    switch (artist.name) {
        case 'tripleS':
            return { logo: tripleS_logo, como: tripleS_como };
        case 'artms':
            return { logo: artms_logo, como: artms_como };
    }

    return { logo: '', como: '' };
}