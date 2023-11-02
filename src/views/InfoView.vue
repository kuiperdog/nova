<template>
    <div id="infoView">
        <img id="logo" src="@/assets/images/logo.svg">
        <h2>Version {{ version }}</h2>
        <h2>by <a href="https://twitter.com/kuipertwt">@kuipertwt</a></h2>
        <span class="gap"></span>
        <h1>Support the project</h1>
        <h2><a href="https://github.com/sponsors/kuiperdog">GitHub Sponsors</a></h2>
        <h2><a href="https://www.patreon.com/kuiperdog">Patreon</a></h2>
        <img id="qr" src="@/assets/images/support-qr.png">
        <p>ETH: 0x18ea10a741Bf3565D45Ba8E7d89B0b5469BeD3fF</p>
        <span class="gap"></span>
        <h2><a href="https://github.com/kuiperdog/nova">View source code</a></h2>
        <h2><a href="https://github.com/kuiperdog/nova/issues">Report a bug/<br>request a feature</a></h2>
        <span class="gap"></span>
        <p>Nova is not endorsed by or affiliated with Modhaus Inc.</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            version: __PACKAGE_VERSION__
        }
    }
}
</script>

<style scoped>
#infoView {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 20px;
    margin: 40px 0px;
    text-align: center;
}

#logo {
    height: 50px;
}

#qr {
    width: 150px
}

.gap {
    margin: 10px 0px;
}

a {
    color: inherit;
}
</style>