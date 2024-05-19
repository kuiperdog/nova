<script lang="ts">
    import { onDestroy, type ComponentProps } from 'svelte';
    import { page } from '$app/stores';
    import ObjektGrid from '$lib/components/common/ObjektGrid.svelte';
	import type ObjektPreview from '$lib/components/common/ObjektPreview.svelte';
    import ObjektScanner from '$lib/components/common/ObjektScanner.svelte';
    import { likedObjekts } from '$lib/utils/stores';
    import { filterCollections } from '$lib/utils/filters';
    import { getArtists, getUnit } from '$lib/utils/artists';
    import { Collection } from '$lib/utils/model';
    import copy_icon from '$lib/assets/icons/copy.svg';
    import camera_icon from '$lib/assets/icons/camera.svg';

    let total: number | null = null;
    let params = $page.url.searchParams;

    async function load(offset: number, length: number): Promise<ComponentProps<ObjektPreview>[]> {
        if (params.has('liked')) {
            if (!$likedObjekts.length) {
                total = 0;
                return [];
            }
            
            if (!$likedObjekts[0].backgroundColor) {
                const res = await fetch(__SUBSQUID_API__, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: `
                            query {
                                ${$likedObjekts.map((collection, index) => `
                                    bookmarks${index}: collectionsConnection(orderBy: id_ASC, where: {id_eq: "${collection.id}"}) {
                                        edges {
                                            node {
                                                backgroundColor
                                            }
                                        }
                                    }
                                `).join('\n')}
                            }
                        `
                    })
                });
                const data = await res.json();

                $likedObjekts = $likedObjekts.map((c, i) => {
                    return { ...c, backgroundColor: data.data[Object.keys(data.data)[i]].edges[0].node.backgroundColor }
                });
            }

            const items = await filterCollections($likedObjekts, params);
            total = items.length;
            return items.map(c => { return { collection: c } });
        }

        let filters: string[] = [];
        let sort = 'timestamp_DESC';
        const artists = await getArtists();

        params.forEach((value, key) => {
            switch (key) {
                case 'artist':
                    if (artists.find(a => a.name === value))
                        filters.push(`artists_containsAll: "${value}"`);
                    else if (artists.find(a => a.members.find(m => m.name === value)))
                        filters.push(`member_eq: "${value}"`);
                    else if (getUnit(value))
                        filters.push(`AND: {member_eq: "${getUnit(value)![0]}"` + getUnit(value)?.slice(1).reduce(
                            (acc, m, i) => acc.slice(0, acc.length - i) + `, OR: {member_eq: "${m}"` + '}'.repeat(i + 1), '') + '}')
                    break;
                case 'season':
                    filters.push(`season_eq: "${value}"`);
                    break;
                case 'class':
                    filters.push(`class_eq: "${value}"`);
                    break;
                case 'number':
                    filters.push(`number_startsWith: "${value}"`);
                    break;
                case 'minNumber':
                    filters.push(`number_gte: "${value}"`);
                    break;
                case 'maxNumber':
                    filters.push(`number_lte: "${value}"`);
                    break;
                case 'type':
                    filters.push(`number_endsWith: "${value}"`);
                    break;
                case 'sort':
                    switch (value) {
                        case 'number':
                            sort = 'number_ASC';
                            break;
                        case 'oldest':
                            sort = 'timestamp_ASC';
                            break;
                    }
                    break;
            }
        });

        const res = await fetch(__SUBSQUID_API__, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: `
                    query {
                        collectionsConnection(orderBy: ${sort}, first: ${length}, ${offset ? `after: "${offset}", ` : ''} where: {${filters.join(', ')}}) {
                            ${ total === null ? `
                                totalCount
                            ` : `` }
                            edges {
                                node {
                                    ${Object.keys(new Collection).join('\n')}
                                }
                            }
                        }
                    }

                `
            })
        });

        const data = await res.json();

        if (total === null)
            total = data.data.collectionsConnection.totalCount;

        return data.data.collectionsConnection.edges.map((e: { node: Collection }): ComponentProps<ObjektPreview> => { return { collection: e.node } });
    }

    onDestroy(page.subscribe(() => {
        if ([...params.entries()].toString() !== [...$page.url.searchParams.entries()].toString()) {
            total = null;
            params = $page.url.searchParams;
        }
    }));

    let _likes = $likedObjekts;
    $: if (_likes !== $likedObjekts) {
        if (params.has('liked') && _likes[0] && _likes[0].backgroundColor)
            total = null;
        _likes = $likedObjekts;
    }

    function copyLikes() {
        navigator.clipboard.writeText(Object.values($likedObjekts.reduce((acc, c) => {
            acc[c.member] = [ c, ...(acc[c.member] || []) ];
            return acc;
        }, {} as {[member: string]: Collection[]})).map(m => {
            return `${m[0].member}: ` + m.map(c => `${c.season.slice(0, 1)}${c.number.slice(0, 3)}`).join(', ');
        }).join('\n'));
    }

    let scanning = false;
</script>

<ObjektGrid {load} {total}/>

{#if params.has('liked')}
    {#if total}
    <button on:click={() => copyLikes()}>
        <img src={copy_icon} alt="Copy" class="copy">
    </button>
    {/if}
{/if}

<slot/>

{#if scanning}
    <ObjektScanner bind:scanning/>
{/if}


<style>
    button {
        width: 60px;
        height: 60px;
        position: sticky;
        bottom: 25px;
        left: calc(100% - 85px);
        border-radius: 30px;
        background-color: var(--accent-color);
        box-shadow: var(--box-shadow);
        border: none;
        padding: 12.5px;
        transition: transform .1s, filter .1s;
        animation: fade-in .1s;
    }

    button img {
        height: 100%;
    }

    button:hover {
        filter: brightness(110%);
    }

    button:active {
        transform: scale(0.95);
    }

    .copy {
        filter: brightness(500%);
    }
</style>
