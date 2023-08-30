import { ethers } from 'ethers'
import { app } from '@/main'
import getArtists from './artists'
import abi from './abi/Objekt.json'

async function getOwner(artist, token) {
    const rpc = app.config.globalProperties.POLYGON_RPC

    const artists = await getArtists()
    const address = artists.find(a => a.name === artist).contracts.Objekt

    const provider = new ethers.JsonRpcProvider(rpc)
    const contract = new ethers.Contract(address, abi, provider)

    try {
        const res = await contract.ownerOf(token)
        return res
    } catch (err) {
        console.log(`Error when fetching token ${token}: ${err}`)
    }

    return '0x0000000000000000000000000000000000000000'
}

export default getOwner