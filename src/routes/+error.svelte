<script lang="ts">
    import status_error_icon from '$lib/assets/icons/status_error.svg';
    import { page } from '$app/stores';
</script>

<div class="container">
    <div class="error">
        <img src={status_error_icon} alt="Error">
        <p>{$page.error?.message}</p>
    </div>
</div>

<style>
    .container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .error {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 20px;
        font-size: 20px;
        background-color: var(--item-color);
        border-radius: 24px;
        box-shadow: var(--box-shadow);
    }

    .error img {
        height: 30px;
    }
</style>