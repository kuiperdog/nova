import { Collection } from "./model";
import { getArtists, getUnit } from "./artists";

export async function filterCollections(collections: Collection[], params: URLSearchParams): Promise<Collection[]> {
    if (params.has('sort')) {
        if (params.get('sort') === 'number')
            collections = collections.sort((a, b) => a.number.localeCompare(b.number));
        else if (params.get('sort') === 'oldest')
            collections = collections.reverse();
    }

    const artists = await getArtists();

    params.forEach((value, key) => {
        switch (key) {
            case 'artist':
                if (artists.find(a => a.name === value))
                    collections = collections.filter(c => c.artists.includes(value));
                else if (artists.find(a => a.members.find(m => m.name === value)))
                    collections = collections.filter(c => c.member === value);
                else if (getUnit(value))
                    collections = collections.filter(c => getUnit(value)?.includes(c.member));
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