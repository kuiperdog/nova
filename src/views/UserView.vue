<script setup>
import Spinner from '../components/Spinner.vue'
import getUser from '../utils/user'
import getArtists from '../utils/artists'
</script>

<template>
    <div class="userView">
        <Spinner v-if="user && !profile" class="spinner"/>
        <div v-if="profile" class="profile">
            <img class="profileImage" :src="profile.profileImageUrl">
            <div class="profileName">
                <h1>{{ profile.nickname }}</h1>
                <h3>
                    <span class="fullAddress">{{ profile.address }}</span>
                    <span class="truncatedAddress">{{ profile.address.slice(0, 6) + '...' + profile.address.slice(-4) }}</span>
                    <img class="copyAddress" src="@/assets/icons/copy.svg" @click="copy(profile.address)">
                </h3>
            </div>
            <div class="chips">
                <div class="chipItems">
                    <span class="como" v-for="artist in artists">
                        <img :src="artist.comoIcon">
                        {{ como ? como[artist.contracts.Como].toLocaleString('en-US') : 0 }}
                    </span>
                </div>
                <div class="chipItems">
                    <a :href="'https://polygonscan.com/address/' + profile.address" class="link" style="background-color: #8247E5;">
                        <img src="@/assets/images/polygon.svg" style="padding: 2.5px;">
                        PolygonScan
                    </a>
                    <a :href="'https://opensea.io/' + profile.address" class="link" style="background-color: #2081E2;">
                        <img src="@/assets/images/opensea.svg">
                        OpenSea
                    </a>
                </div>
            </div>
        </div>
        <div class="routerLinks" v-if="profile">
            <RouterLink :to="`/@${user}/collection`">Collection</RouterLink>
            <RouterLink :to="`/@${user}/trades`">Trades</RouterLink>
            <RouterLink :to="`/@${user}/votes`">Votes</RouterLink>
        </div>
        <RouterView v-if="profile" :address="profile.address"/>
    </div>
</template>

<script>
export default {
    data() {
        return {
            profile: null,
            artists: null,
            como: null
        }
    },
    mounted() {
        if (this.user)
            this.getUser()
    },
    methods: {
        async getUser() {
            this.profile = null
            this.como = null
            
            if (!this.artists)
                this.artists = await getArtists()

            if (this.user.startsWith('0x')) {
                this.profile = await getUser(this.user)
            } else {
                const res = await fetch(`${this.COSMO_API}/user/v1/by-nickname/${this.user}`)
                const data = await res.json()
                this.profile = data.profile
                
                if (!this.profile.profileImageUrl)
                    this.profile.profileImageUrl = this.DEFAULT_PFP
            }

            const res = await fetch(`https://polygon-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    'method': 'alchemy_getTokenBalances',
                    'params': [
                        this.profile.address,
                        this.artists.map(a => a.contracts.Como)
                    ]
                })
            })
            const data = await res.json()
            this.como = data.result.tokenBalances.reduce((list, token) => {
                list[token.contractAddress] = parseInt(token.tokenBalance, 16) / Math.pow(10, 18)
                return list
            }, {})
        },
        copy(text) {
            navigator.clipboard.writeText(text)
        }
    },
    watch: {
        user() {
            if (this.user && (!this.profile || (this.profile.address !== this.user && this.profile.nickname !== this.user)))
                this.getUser()
            else if (!this.user)
                this.profile = null
            this.suggestions = null
        }
    },
    props: {
        user: String
    }
}
</script>

<style scoped>
.userView {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin: 20px 0px;
    gap: 40px;
}

.spinner {
    flex: 1;
}

.profile {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
}

.profileImage {
    height: 75px;
    border-radius: 50px;
}

.profileName h1 {
    line-height: 50px;
    word-break: break-all;
}

.profileName h3 {
    line-height: 25px;
    color: #49565E;
    display: flex;
    align-items: center;
    gap: 5px;
}

.fullAddress {
    word-break: break-all;
}

.truncatedAddress {
    display: none;
}

.copyAddress {
    height: 1em;
    cursor: pointer;
}

.profileName {
    flex: 1;
}

.chips {
    display: flex;
    flex-direction: column;
    align-items: end;
    gap: 15px;
}

.chipItems {
    display: flex;
    gap: 5px;
}

.link, .como {
    border-radius: 5px;
    padding: 5px 10px;
    line-height: 20px;
    display: flex;
    align-items: center;
}

.link {
    border-radius: 25px;
    cursor: pointer;
    gap: 5px;
}

.link img, .como img {
    height: 20px;
}

.como {
    background-color: #2A333A;
    gap: 20px;
}

.routerLinks {
    display: flex;
    background-color: #171C20;
    padding: 5px;
    gap: 10px;
    border-radius: 10px;
    color: #7C8992
}

.routerLinks > a {
    flex: 1;
    text-align: center;
    font-size: 18px;
    line-height: 40px;
    text-decoration: none;
    transition: background-color .1s;
    border-radius: 10px;
}

.router-link-active {
    background-color: #2A333A;
    color: #FFFFFF;
}

a {
    color: inherit;
}

@media only screen and (max-width: 670px) {
    .truncatedAddress {
        display: initial;
    }
    .fullAddress {
        display: none;
    }
    .profile {
        justify-content: center;
    }
    .profileName {
        flex: 0;
    }
    .chips {
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
    }
}
</style>