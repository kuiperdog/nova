<div class="settings">
    <p class="disclaimer">Nova is not created by, endorsed by, or affiliated with Modhaus Inc.</p>
</div>

<style>
    .settings {
        height: 100%;
        margin-left: auto;
        width: 300px;
        background-color: var(--background-semitransparent);
        box-shadow: var(--box-shadow);
        backdrop-filter: blur(calc(var(--blur-radius) * 2));
        -webkit-backdrop-filter: blur(calc(var(--blur-radius) * 2));
        padding: 20px;
        display: flex;
        gap: 10px;
        animation: slide 0.5s;
    }

    .disclaimer {
        text-align: center;
        align-self: flex-end;;
    }
    @keyframes slide {
        0% {
            transform: translateX(100%);
        }
        100% {
            transform: translateX(0%);
        }
    }
</style>