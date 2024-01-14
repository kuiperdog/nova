<script lang="ts">
	import nova_logo from '$lib/assets/images/logo.svg';
	import ArtistSelector from './ArtistSelector.svelte';
	import { Cosmo } from '$lib/data/apis';
	import { t, locale } from 'svelte-i18n';

	const version = __VERSION__;

	let selected: Cosmo.Artist | undefined;
	let _selected: Cosmo.Artist | undefined;

	$: if (selected && _selected !== selected) {
		_selected = selected;
		window.localStorage.setItem('defaultArtist', selected.name);
	}

    function setLanguage(lang: string) {
        window.localStorage.setItem('language', lang);
        $locale = lang;
    }

	$: console.log($locale);
</script>

<div class="settings">
	<div class="setting">
		<b>{$t('settings.default_artist')}</b>
		<ArtistSelector bind:selected />
	</div>
	<div class="setting">
		<b>{$t('settings.language')}</b>
		<div class="languageSelector">
			<button class:active={$locale && $locale.startsWith('en')} on:click={() => setLanguage('en')}>
                🇬🇧 English
            </button>
			<button class:active={$locale && $locale.startsWith('ko')} on:click={() => setLanguage('ko')}>
                🇰🇷 한국어
            </button>
		</div>
	</div>
	<img class="logo" src={nova_logo} alt="Nova" />
	<p>
		{@html $t('settings.version', {
			values: {
				version: version,
				author: '<a href="https://twitter.com/kuiperdog" style="color: inherit;">Kuiper</a>'
			}
		})}
	</p>
	<p>
		<a href="https://github.com/kuiperdog/nova">{$t('settings.source')}</a>
		|
		<a href="https://patreon.com/kuiperdog">{$t('settings.donations')}</a>
		|
		<a href="https://github.com/kuiperdog/nova/issues">{$t('settings.bugs')}</a>
	</p>
	<p class="disclaimer">{$t('settings.disclaimer')}</p>
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
		flex-direction: column;
		gap: 20px;
		text-align: center;
		align-items: center;
		animation: slide 0.5s;
	}

	.logo {
		margin-top: auto;
		width: 100px;
	}

	a {
		color: inherit;
	}

	.setting {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.languageSelector {
		display: flex;
		background-color: var(--item-color);
		border-radius: 10px;
		gap: 5px;
	}

	.languageSelector button {
		background: none;
		border: none;
		padding: 5px 10px;
		color: var(--text-color);
		border-radius: 10px;
		font-weight: bold;
	}

	.languageSelector button.active {
		background-color: var(--accent-color);
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
