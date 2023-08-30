async function getUser(address) {
    return {
        nickname: address.slice(0, 6) + '...' + address.slice(-4),
        address: address,
        profileImageUrl: 'https://static.cosmo.fans/uploads/images/img_profile_gallag@3x.png'
    }
}

export default getUser