<script lang="ts">
    export let voteStart: number;
    export let voteEnd: number;
    export let pollId: number;

    let countdown = -1;

    if (voteStart > Date.now()) {
        const interval = window.setInterval(() => {
            if (voteStart > Date.now()) {
                countdown = voteStart - Date.now();
            } else {
                subscribe();
                window.clearInterval(interval);
            }
        }, 1000);
        countdown = voteStart - Date.now();
    } else if (voteEnd > Date.now()) {
        subscribe();
    }

    function subscribe() {
        window.setTimeout(() => {
            // Unsubscribe
        }, voteEnd - Date.now());
    }
</script>

{#if countdown > -1}
    <div class="countdown">
        <p>Voting will open in</p>
        <h3>{String(Math.floor((countdown % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))).padStart(2, '0') 
            + ':' + String(Math.floor((countdown % (60 * 60 * 1000)) / (60 * 1000))).padStart(2, '0')
            + ':' + String(Math.floor((countdown % (60 * 1000)) / 1000)).padStart(2, '0')}</h3>
    </div>
{:else}
    <div class="votes">
    </div>
{/if}

<style>
    .votes, .countdown {
        background-color: var(--item-color);
        border-radius: 20px;
        padding: 20px;
        flex: 1;
    }

    .countdown {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 20px;
    }

    .countdown h3 {
        font-size: 24px;
        font-family: 'Dot-Matrix';
    }
</style>