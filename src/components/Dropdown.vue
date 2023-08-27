<template>
    <div class="dropdown">
        <div class="option selected" @click="open = !open">
            <img class="icon" v-if="selection.icon" :src="selection.icon">
            <p>{{ selection.label }}</p>
            <img class="indicator" src="@/assets/icons/dropdown.svg" :class="{ turned: open }">
        </div>
        <div class="options" :style="{ 'max-height': open ? Math.min(options.length * 50, 500) + 'px' : 0 }">
            <div class="optionsContent">
                <div class="option" v-for="option in options" @click="select(option)">
                    <img class="icon" v-if="option.icon" :src="option.icon">
                    <p>{{ option.label }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            selection: this.options.find(o => o.value === this.value),
            open: false
        }
    },
    created() {
        if (!this.selection)
            this.selection = this.options[0]
    },
    props: {
        options: {
            type: Array,
            default: []
        },
        value: {
            type: String,
            default: ''
        }
    },
    methods: {
        select(option) {
            this.open = false
            this.selection = option
            this.$emit('valueChanged', option.value)
        }
    },
    emits: ['valueChanged']
}
</script>

<style scoped>
.dropdown {
    position: relative;
    background-color: #171C20;
    border: 2px solid #2A333A;
    border-radius: 15px;
}

.options {
    position: absolute;
    margin-top: 2px;
    z-index: 1;
    background-color: inherit;
    border-radius: inherit;
    width: 100%;
    max-height: 0;
    transition: max-height 0.25s;
    overflow: hidden;
}

.optionsContent {
    overflow-y: scroll;
    height: 500px;
}

.option {
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0px 15px;
    gap: 10px;
    cursor: pointer;
    transition: background-color 0.25s;
    border-radius: inherit;
}

.option:hover {
    background-color: #1D2226;
}

.icon {
    width: 35px;
    height: 35px;
    border-radius: 17.5px;
}

.option p {
    font-size: 18px;
}

.selected .icon {
    border: solid 2px #9756FF;
}

.selected .indicator {
    margin-left: auto;
    transition: transform 0.25s;
}

.turned {
    transform: rotate(180deg);
}
</style>