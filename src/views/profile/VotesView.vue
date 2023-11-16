<script setup>
import getArtists from '../../utils/artists'
import { ethers } from 'ethers'
</script>

<template>
    <div class="votesView">
        <img v-if="loading" src="@/assets/icons/dots.svg" class="dots">
        <div v-else class="votes">
            <template v-for="poll in polls">
                <div class="title">
                    <img :src="artists.find(a => a.name === poll.gravity.artist).logoImageUrl">
                    <p>{{ poll.gravity.title }}<span v-if="poll.gravity.polls.length > 1"> - {{ poll.poll.title }}</span></p>
                </div>
                <template v-for="vote in poll.votes">
                    <div>
                        <p>{{ new Date(Number(vote.timestamp)).toLocaleString() }}</p>
                    </div>
                    <div>
                        <p>{{ Math.round(ethers.formatEther(vote.amount)).toLocaleString('en-us') }} COMO</p>
                    </div>
                    <div class="choice">
                        <p v-if="vote.candidate !== undefined"><b>{{ getChoice(vote.candidate, poll.details) }}</b></p>
                        <p v-else><i>Unrevealed</i></p>
                    </div>
                </template>
                <div v-if="!polls.length">
                    <p>User has not voted in any Gravity.</p>
                </div>
            </template>
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
                            candidate
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
            const entry = acc.find((poll) => poll.id === vote.poll && poll.votes[0].contract === vote.contract)
            if (entry) {
                entry.votes.unshift(vote)
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

        const details = await Promise.all(this.polls.map(p => 
            fetch(`${this.COSMO_API}/gravity/v3/${p.gravity.artist}/gravity/${p.gravity.id}/polls/${p.poll.id}`,
            { headers: { "Authorization": "Bearer " + import.meta.env.VITE_COSMO_TOKEN } }).then(r => r.json())))

        for (let i = 0; i < details.length; i++)
            this.polls[i].details = details[i].pollDetail

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
        },
        getChoice(candidate, pollDetails) {
            if (pollDetails.choices[candidate].title)
                return pollDetails.choices[candidate].title

            if (pollDetails.type === 'combination-poll') {
                const data = pollDetails.pollViewMetadata
                const table = data.choiceIdToSlotChoicesMapTable
                return data.slots.map((s, i) =>
                    s.name + ': ' + data.slotChoices.find(c => c.id === table[candidate].slotChoiceIds[i]).name).join(', ')
            }
            return pollDetails.choices[candidate].id
        }
    },
    props: {
        address: String
    }
}
</script>

<style scoped>
.votesView {
    display: flex;
    align-items: center;
    flex-direction: column;
    font-size: 18px;
}

.dots {
    width: 50px;
}

.votes {
    display: grid;
    grid-template-columns: repeat(3, auto);
}

.votes > div {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;
    text-align: center;
}

.title {
    margin-top: 20px;
    grid-column: span 3;
    gap: 10px;
    font-family: 'Halvar Breit';
    background: rgba(42, 51, 58, 0.25);
}

.title:first-child {
    margin-top: 0;
}

.title img {
    height: 24px;
    border-radius: 12px;
}
</style>
