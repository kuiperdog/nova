<script setup>
import ObjektGrid from '../components/ObjektGrid.vue'
</script>

<template>
    <ObjektGrid :objekts="objekts" :total="objekts.length" :loading="false">
        <template v-slot:status>
            <h2 class="total">{{ objekts.length }} bookmarks</h2>
            <button @click="copy()">Copy</button>
            <button @click="clear()">Clear</button>
        </template>
        <template v-slot:filters>
            <div></div>
        </template>
    </ObjektGrid>
</template>

<script>
export default {
    data() {
        return {
            objekts: localStorage.bookmarks ? JSON.parse(localStorage.bookmarks) : []
        }
    },
    mounted() {
        window.addEventListener('storage', this.updated)
    },
    unmounted() {
        window.removeEventListener('storage', this.updated)
    },
    methods: {
        copy() {
            const members = {}
            this.objekts.forEach(i => {
                if (!members[i.member])
                    members[i.member] = []
                members[i.member].push(i)
            })

            let text = ''
            for (const member of Object.keys(members).sort()) {
                text += member + ': ' + members[member].map((i) =>
                    i.season.charAt(0) + i.number.substring(0, 3)
                ).sort().join(', ') + '\n'
            }

            navigator.clipboard.writeText(text)
        },
        clear() {
            localStorage.bookmarks = JSON.stringify([])
            this.objekts = []
        },
        updated() {
            this.objekts = localStorage.bookmarks ? JSON.parse(localStorage.bookmarks) : []
        }
    }
}
</script>

<style scoped>
.total {
    flex: 1;
}

button {
    background-color: #171C20;
    border: 2px solid #2A333A;
    border-radius: 15px;
    color: #FFFFFF;
    padding: 10px 20px;
    font-size: 16px;
}

button:hover {
    background-color: #1D2226;
    cursor: pointer;
}

button:active {
    background-color: #2A333A;
}
</style>
