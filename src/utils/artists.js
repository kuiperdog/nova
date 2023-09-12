import { app } from '@/main.js'
import comoIcons from './comoicons'
let artists = null

async function getArtists() {
    if (artists)
        return artists

    const api = app.config.globalProperties.COSMO_API

    const _artists = []
    const res = await fetch(api + '/artist/v1')
    const artistList = (await res.json()).artists
    for (const artist of artistList) {
        const artistData = await fetch(api + '/artist/v1/' + artist.name)
        _artists.push((await artistData.json()).artist)
    }

    _artists.forEach(a => a.comoIcon = comoIcons[a.name])

    artists = _artists
    return _artists
}

export default getArtists