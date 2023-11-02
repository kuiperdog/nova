<template>
    <div class="searchBar" ref="searchBar">
        <input type="text" class="searchBox" placeholder="Search by nickname or address" ref="searchBox"
            @keyup.enter="e => { $router.push(`/@${e.target.value}`); clear() }" @input="e => search(e.target.value)">
        <div v-if="suggestions" class="searchSuggestions">
            <RouterLink v-for="suggestion in suggestions" :to="`/@${suggestion.nickname}`" class="suggestion" @click="clear()">
                <img :src="suggestion.profileImageUrl ? suggestion.profileImageUrl : DEFAULT_PFP">
                <p>{{ suggestion.nickname }}</p>
            </RouterLink>
        </div>
    </div>
    <img class="searchIcon" ref="searchIcon" src="@/assets/icons/searchnav.svg" @click="toggleDisplay()">
</template>

<script>
export default {
    data() {
        return {
            timeout: null,
            suggestions: null
        }
    },
    mounted() {
        document.addEventListener('click', this.handleClick)
    },
    unmounted() {
        document.removeEventListener('click', this.handleClick)
    },
    methods: {
        search(query) {
            clearTimeout(this.timeout)
            this.timeout = setTimeout(async () => {
                if (!query && query.length < 4 && !query.startsWith('0x')) {
                    this.suggestions = null
                    return
                }
                const res = await fetch(`${this.COSMO_API}/user/v1/search?query=${query}`)
                const data = await res.json()
                this.suggestions = data.results
            }, 500)
        },
        handleClick(event) {
            if (!this.$refs.searchBox.contains(event.target))
                this.suggestions = null
        },
        clear() {
            clearTimeout(this.timeout)
            this.$refs.searchBox.value = null
            this.suggestions = null
            if (this.$refs.searchBar.classList.contains('showBar'))
                this.$refs.searchBar.classList.remove('showBar')
        },
        toggleDisplay() {
            this.$refs.searchBar.classList.toggle('showBar')
        }
    }
}
</script>

<style scoped>
.searchBar {
    position: relative;
}

.searchBox {
    font-family: inherit;
    font-size: 18px;
    padding: 5px;
    padding-left: 30px;
    border-radius: 10px;
    border: none;
    outline: none;
    background-image: url('@/assets/icons/search.svg');
    background-repeat: no-repeat;
    background-size: 20px 20px;
    background-position: 6px 6px;
    height: 30px;
    width: 300px;
    background-color: #F4F5F7;
    color: #000000;
}

::placeholder {
    color: #2A333A;
}

.searchSuggestions {
    position: absolute;
    top: 30px;
    width: 300px;
    max-height: 250px;
    overflow-y: scroll;
    border-radius: 10px;
    background-color: #F4F5F7;
    color: #000000;
    margin-top: 2px;
    z-index: 1;
}
.suggestion {
    width: 100%;
    height: 40px;
    display: flex;
    padding: 10px;
    gap: 10px;
    align-items: center;
    transition: background-color 0.1s;
}

.suggestion:hover {
    background-color: rgba(0, 0, 0, 0.1);
}

.suggestion img {
    height: 100%;
}

a {
    color: inherit;
}

.searchIcon {
    display: none;
    cursor: pointer;
}

.searchBar, .searchIcon {
    margin-left: auto;
}

.showBar + .searchIcon {
    filter: brightness(500%);
}

@media only screen and (max-width: 700px) {
    .searchBar, .searchIcon {
        margin-left: 0;
    }
}

@media only screen and (max-width: 900px) {
    .searchBar {
        display: none;
        order: 99;
        flex-basis: 100%;
        justify-content: center;
        margin-bottom: 10px;
    }
    .searchIcon {
        display: initial;
    }
    .showBar {
        display: flex;
    }
}
</style>
