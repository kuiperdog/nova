import cosmoIcon from '@/assets/images/cosmo-light.png'

async function getUser(address) {
    if (address === '0x0000000000000000000000000000000000000000') {
        return {
            nickname: 'Cosmo',
            address: address,
            profileImageUrl: cosmoIcon
        }
    }

    return {
        nickname: address.slice(0, 6) + '...' + address.slice(-4),
        address: address,
        profileImageUrl: 'https://static.cosmo.fans/uploads/images/img_profile_gallag@3x.png'
    }
}

export default getUser