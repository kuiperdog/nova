<script lang="ts">
	export let collectionId: string;
	export let collectionNo: string;
	export let thumbnail: string;
	export let textColor: string;
	export let serial: number | null;

	let width: number;
	let loaded = false;
	let img: HTMLImageElement;
</script>

<div class="preview" bind:clientWidth={width} style="height: {width * 487/314}px;">
	<div class="thumbnail" style="opacity: {loaded || img && img.complete ? '1' : '0'};">
		<img src={thumbnail} bind:this={img} on:load={() => loaded = true} alt={collectionId}>
		<div class="sideBar" style="font-size: {width * 0.05}px; color: {textColor};">
			<p>{collectionNo}</p>
			{#if serial}
				<p class="serial">{serial}</p>
			{/if}
		</div>
	</div>
</div>

<style>
	.preview {
		transition: transform 0.25s ease-in-out;
		background-color: var(--placeholder-color);
        border-radius: 5% / calc(5% * 314/487);
		box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.25);
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
