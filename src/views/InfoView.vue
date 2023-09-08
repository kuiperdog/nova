<template>
    <div id="infoView">
        <img id="logo" src="@/assets/images/logo.svg">
        <h2>Version {{ version }}</h2>
        <h2>by <a href="https://twitter.com/kuipertwt">@kuipertwt</a></h2>
        <span class="gap"></span>
        <h1>Support the project</h1>
        <img id="qr" src="@/assets/images/support-qr.png">
        <p>ETH: 0x661CB72daC01Fb6Ea7f62ab7f0315ae98a7713aF</p>
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