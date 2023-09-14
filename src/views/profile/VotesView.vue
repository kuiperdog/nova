<script setup>
import getArtists from '../../utils/artists'
import { ethers } from 'ethers'
</script>

<template>
    <div class="votesView">
        <template v-for="poll in polls">
            <div class="title">
                <img :src="artists.find(a => a.name === poll.gravity.artist).logoImageUrl">
                <p>{{ poll.gravity.title }}<span v-if="poll.gravity.polls.length > 1"><br>{{ poll.poll.title }}</span></p>
            </div>
            <template v-for="vote in poll.votes">
                <p style="text-align: end;">{{ new Date(Number(vote.timestamp)).toLocaleString() }}</p>
                <b>{{ Math.round(ethers.formatEther(vote.amount)).toLocaleString('en-us') }} COMO</b>
            </template>
            <br>
        </template>
        <h3 class="emptyNotice" v-if="!loading && polls.length < 1">
            No COMO has been voted yet.
        </h3>
        <div class="loader" v-if="loading">
            <img src="@/assets/icons/dots.svg" class="dots">
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loading: true,
            artists: null,
            polls: []
        }
    },
    async mounted() {
        const res = await fetch(this.SUBSQUID_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    query {
                        votes(orderBy: timestamp_DESC, where: {from_eq: "${this.address}"}) {
                            amount
                            contract
                            poll
                            timestamp
                        }
                    }

                `
            })
        })
        const data = await res.json()

        this.artists = await getArtists()
        const contracts = data.data.votes.reduce((acc, item) => {
            if (!acc.includes(item.contract))
                acc.push(item.contract)
            return acc
        }, [])

        let gravities = await Promise.all(this.artists.filter(a => contracts.includes(a.contracts.Governor.toLowerCase()))
                                     .map(a => fetch(`${this.COSMO_API}/gravity/v3/${a.name}`).then(res => res.json())))

        gravities = [].concat(...gravities.map(g => [...g.upcoming, ...g.ongoing, ...g.past]))

        this.polls = data.data.votes.reduce((acc, vote) => {
            const entry = acc.find((poll) => poll.id === vote.poll)
            if (entry) {
                entry.votes.push(vote)
            } else {
                const artist = this.artists.find(a => vote.contract === a.contracts.Governor.toLowerCase())
                const gravity = gravities.find(g => g.artist === artist.name && this.getPoll(vote, g))
                acc.push({
                    gravity: gravity,
                    id: vote.poll,
                    poll: this.getPoll(vote, gravity),
                    votes: [vote]
                })
            }
            return acc
        }, [])

        this.loading = false
    },
    methods: {
        getPoll(vote, gravity) {
            const inTimespan = (p) => (new Date(p.startDate).getTime() <= vote.timestamp && new Date(p.endDate).getTime() >= vote.timestamp)

            const pollFromChain = gravity.polls.find(p => p.pollIdOnChain == vote.poll && inTimespan(p))
            if (pollFromChain)
                return pollFromChain

            const pollFromId = gravity.polls.find(p => p.id == vote.poll && inTimespan(p))
            if (pollFromId)
                return pollFromId

            return gravity.polls.find(p => p.id - 1 == vote.poll && inTimespan(p))
        }
    },
    props: {
        address: String
    }
}
</script>

<style scoped>
.votesView {
    width: 100%;
    display: grid;
    grid-template-columns: auto auto;
    gap: 20px;
    font-size: 20px;
}

.loader {
    grid-column: span 2;
    display: flex;
    justify-content: center;
}
.dots {
    width: 50px;
}

.title {
    grid-column: span 2;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-size: 24px;
    font-family: 'Halvar Breit';
}

.title img {
    height: 40px;
    border-radius: 20px;
}

.title p {
    white-space: pre-wrap;
}

.emptyNotice {
    text-align: center;
    grid-column: span 2;
}
</style>
