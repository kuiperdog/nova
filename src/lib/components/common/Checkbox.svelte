<script lang="ts">
    import icon from '$lib/assets/icons/check.svg';
    
    export let checked: boolean = false;
</script>

<label>
    <img src={icon} alt="Check">
    <input bind:checked type="checkbox">
    <slot/>
</label>

<style>
    label {
        display: flex;
        align-items: center;
        gap: 5px;
        height: 20px;
        position: relative;;
    }

    input {
        appearance: none;
        width: 20px;
        height: 20px;
        border: 2px solid var(--button-border);
        border-radius: 10px;
        outline: none;
        cursor: pointer;
        transition: background-color .1s, border-color .1s;
    }

    input:checked {
        background-color: var(--accent-color);
        border-color: var(--accent-color);
    }

    img {
        position: absolute;
        top: 0;
        left: 0;
        height: 20px;
        padding: 2px;
        transition: opacity .1s;
        opacity: 0;
    }

    label:has(input:checked) img {
        opacity: 1;;
    }
</style>