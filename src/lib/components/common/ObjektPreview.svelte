<script lang="ts">
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import type { Subsquid } from '$lib/data/apis';

	export let collection: Subsquid.Collection;
	export let objekt: Subsquid.Objekt | null = null;

	let width: number;
	let loaded = false;
	let img: HTMLImageElement;
</script>

<button class="preview" bind:clientWidth={width} style="height: {width * 487/314}px;" on:click={
	() => pushState(`/objekt/${collection.id}` + (objekt ? `/${objekt.serial}` : ''), { collection: collection, objekt: objekt, previous: $page.url.href })
}>
	<div class="thumbnail" style="opacity: {loaded || img && img.complete ? '1' : '0'};">
		<img src={collection.thumbnail} bind:this={img} on:load={() => loaded = true} alt={collection.id}>
		<div class="sideBar" style="font-size: {width * 0.05}px; color: {collection.textColor};">
			<p>{collection.number}</p>
			{#if objekt}
				<p class="serial">{objekt.serial}</p>
			{/if}
		</div>
	</div>
</button>

<style>
	.preview {
		transition: transform 0.25s ease-in-out;
		background-color: var(--placeholder-color);
        border-radius: 5% / calc(5% * 314/487);
		box-shadow: var(--box-shadow);
		border: none;
		padding: 0;
		cursor: pointer;
	}

	.preview:hover {
		transform: scale(1.05);
	}

	.thumbnail {
		position: relative;
		transition: opacity 0.5s;
	}

	img {
		width: 100%;
	}

	.sideBar {
		position: absolute;
		top: 0;
		right: 0;
		width: 11%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		writing-mode: vertical-lr;
		font-family: 'Helvetica Neue';
		text-align: center;
		padding-right: 1.5%;
	}

	.serial {
		font-family: 'Dot-Matrix';
	}
</style>
