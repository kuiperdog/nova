<script setup>
import Spinner from '../components/Spinner.vue'
import getUser from '../utils/user'
import getArtists from '../utils/artists'
</script>

<template>
    <div class="profileView">
        <Spinner v-if="!profile" class="spinner"/>
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
                        0
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
        <RouterView v-if="profile" :address="profile.address"/>
    </div>
</template>

<script>
export default {
    data() {
        return {
            profile: null,
            artists: null
        }
    },
    async mounted() {
        this.artists = await getArtists()
        this.getUser()
    },
    methods: {
        async getUser() {
            this.profile = null

            if (this.user.startsWith('0x')) {
                this.profile = await getUser(this.user)
            } else {
                const res = await fetch(`${this.COSMO_API}/user/v1/by-nickname/${this.user}`)
                const data = await res.json()
                this.profile = data.profile
                
                if (!this.profile.profileImageUrl)
                    this.profile.profileImageUrl = 'https://static.cosmo.fans/uploads/images/img_profile_gallag@3x.png'
            }
        },
        copy(text) {
            navigator.clipboard.writeText(text)
        }
    },
    props: {
        user: String
    }
}
</script>

<style scoped>
.profileView {
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