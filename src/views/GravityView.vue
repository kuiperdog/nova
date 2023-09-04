<script setup>
import { ethers } from 'ethers'
import Dropdown from '../components/Dropdown.vue'
import VoteChart from '../components/VoteChart.vue'
import getArtists from '../utils/artists'
import getSlots from '../utils/slots'
import abi from '../utils/abi/Governor.json'
</script>

<template>
    <div v-if="loading" id="loading">
        <img id="spinner" src="@/assets/icons/spinner.svg">
    </div>
    <div v-if="!loading" id="gravityView">
        <div id="header">
            <h1 id="title">{{ gravity.title }}</h1>
            <div class="headerItems">
                <div class="headerItem">
                    <Dropdown id="artistDropdown" @valueChanged="x => $router.push(`/gravity/${x}`)" :value="gravity.artist" :options="artists"/>
                    <img id="history" src="@/assets/icons/history.svg">
                </div>
                <div class="headerItem">
                    <h2 v-if="gravity.polls.length > 1" :poll="pollId"><b>{{ poll.title }}</b></h2>
                    <h2>{{ currentComo.toLocaleString('en-us') }}/{{ totalComo.toLocaleString('en-us') }} COMO</h2>
                    <h2 id="liveIndicator">LIVE</h2>
                </div>
            </div>
        </div>
        <VoteChart v-if="currentComo" :poll="pollId" :contract="contract.target"/>
        <div class="progress">
            <p class="progressLabel">
                {{ currentVotes.toLocaleString('en-us') }}/{{ totalVotes.toLocaleString('en-us') }} Votes
                ({{ Math.floor(currentVotes/totalVotes) * 100 }}%)
            </p>
            <div class="progressBar" :style="{ width: Math.floor(currentVotes/totalVotes * 100) + '%'}"></div>
        </div>
        <div id="polls">
            <div class="poll" v-for="slot in slots">
                <h2 v-if="slots.length > 1"><b>{{ slot.name }}</b></h2>
                <div class="progress choice" v-for="choice in slot.choices">
                    <p class="progressLabel">{{ choice.name }} - {{ choice.como.toLocaleString('en-US') }} COMO</p>
                    <div class="progressBar" :style="{ width: Math.round(choice.como / totalComo * 100) + '%' }"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loading: true,
            artists: null,
            gravity: null,
            poll: null,
            pollId: 0,
            contract: null,
            currentComo: 0,
            totalComo: 0,
            currentVotes: 0,
            totalVotes: 0,
            candidates: [],
            slots: []
        }
    },
    async mounted() {
        this.artists = (await getArtists()).map(artist => Object({
            value: artist.name,
            label: artist.title,
            icon: artist.logoImageUrl
        }))

        await this.getGravity()
    },
    watch: {
        artist() {
            this.getGravity()
        },
        gravityId() {
            this.getGravity()
        }
    },
    methods: {
        async getGravity() {
            this.loading = true
            const endpoint = this.COSMO_API + '/gravity/v3/'

            if (this.artist) {
                if (this.gravityId) {
                    const res = await fetch(endpoint + this.artist + '/gravity/' + this.gravityId)
                    const data = await res.json()
                    this.gravity = data.gravity
                } else {
                    const res = await fetch(endpoint + this.artist)
                    const data = await res.json()

                    if (data.ongoing.length)
                        this.gravity = data.ongoing[0]
                    else if (data.upcoming.length)
                        this.gravity = data.upcoming[0]
                    else
                        this.gravity = data.past[0]
                }
            } else {
                const list = await Promise.all(this.artists.map(async a => {
                    const res = await fetch(endpoint + a.value)
                    return res.json()
                }))
                
                if (list.find(i => i.ongoing.length))
                    this.gravity = list.find(i => i.ongoing.length).ongoing[0]
                else if (list.find(i => i.upcoming.length))
                    this.gravity = list.find(i => i.upcoming.length).upcoming[0]
                else
                    this.gravity = list.reduce((a, b) => new Date(a.past[0].entireEndDate) > new Date(b.past[0].entireEndDate) ? a : b).past[0]
            }

            if (this.index)
                this.poll = this.gravity.polls[Math.max(Number(this.index), 1) - 1]
            else
                this.poll = this.gravity.polls.find(p => (new Date(p.revealDate).getTime() > Date.now()))
            if (!this.poll)
                this.poll = this.gravity.polls[this.gravity.polls.length - 1]

            const address = (await getArtists()).find(a => a.name === this.gravity.artist).contracts.Governor
            const provider = new ethers.JsonRpcProvider(this.POLYGON_RPC)
            this.contract = new ethers.Contract(address, abi, provider)

            const cosmoData = await getSlots(this.gravity, this.poll.id)
            this.slots = cosmoData.slots

            this.pollId = this.poll.pollIdOnChain ? this.poll.pollIdOnChain : this.poll.id

            this.candidates = await this.contract.candidates(this.pollId)
            if (JSON.stringify([...this.candidates].sort()) !== JSON.stringify([...cosmoData.candidates].sort())) {
                this.pollId -= 1
                this.candidates = await this.contract.candidates(this.pollId)
            }

            this.totalVotes = 0

            await this.getVotes()
            this.loading = false
        },
        async getVotes() {
            const votes = await this.contract.votesPerCandidates(this.pollId)
            this.slots.forEach(slot => slot.choices.forEach(choice => choice.como = 0))
            votes.forEach((como, index) => {
                this.slots.forEach((slot) => {
                    slot.choices.forEach((choice) => {
                        if (choice.ids.includes(this.candidates[index]))
                            choice.como += Math.round(ethers.formatEther(como))
                    })
                    slot.choices.sort((a, b) => b.como - a.como)
                })
            })

            const poll = await this.contract.polls(this.pollId)
            this.currentComo = votes.reduce((a, b) => a + Math.round(ethers.formatEther(b)), 0)
            this.totalComo = Math.round(ethers.formatEther(poll[4]))
            this.currentVotes = ethers.toNumber(poll[5])
            if (!this.currentVotes || !this.totalVotes)
                this.totalVotes = ethers.toNumber(await this.contract.totalVotes(this.pollId))
        }
    },
    props: {
        artist: String,
        gravityId: String,
        index: String
    }
}
</script>

<style scoped>
#loading {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

#spinner {
    width: 100px;
}

#gravityView {
    display: flex;
    flex-direction: column;
    gap: 30px;
    width: 1080px;
    padding: 40px 20px;
}

#header {
    display: flex;
    align-items: center;

}

#title {
    font-family: 'Halvar Breit Bold';
    font-size: 36px;
    line-height: 1.6em;
    white-space: pre;
    flex: 1;
}

.headerItems {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.headerItem {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: end;
    gap: 20px;
}

#history {
    height: 30px;
}

#liveIndicator {
    background-color: #B71C1C;
    color: #FFFFFF;
    padding: 5px 10px;
    border-radius: 10px;
}

#progressBar {
    height: 30px;
    background-color: #9756FF;
    border-radius: 5px;
}

#polls {
    display: flex;
    gap: 20px;
}

.poll {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.progress {
    height: 40px;
    border-radius: 5px;
    overflow: hidden;
    background-color: #232A30;
    position: relative;
}

.progress.choice {
    border-radius: 20px;
}

.progressLabel {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 10px;
    color: #FFFFFF;
    font-size: 18px;
}

.progressBar {
    height: 100%;
    width: 0;
    background-color: #9756FF;
}
</style>