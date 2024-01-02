import { Cosmo } from "./apis";
import artms_logo from "$lib/assets/images/artms_logo.svg";
import tripleS_logo from "$lib/assets/images/tripleS_logo.svg";
import artms_como from "$lib/assets/images/artms_como.svg";
import tripleS_como from "$lib/assets/images/tripleS_como.svg";

interface ArtistAssets {
    logo: string;
    como: string;
};

export function getAssets(artist: Cosmo.Artist): ArtistAssets {
    switch (artist.name) {
        case 'tripleS':
            return { logo: tripleS_logo, como: tripleS_como };
        case 'artms':
            return { logo: artms_logo, como: artms_como };
    }

    return { logo: '', como: '' };
}