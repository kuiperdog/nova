<script lang="ts">
    import { onDestroy, type ComponentProps } from 'svelte';
    import { page } from '$app/stores';
    import ObjektGrid from '$lib/components/common/ObjektGrid.svelte';
	import type ObjektPreview from '$lib/components/common/ObjektPreview.svelte';
    import ObjektScanner from '$lib/components/common/ObjektScanner.svelte';
    import { Subsquid, Cosmo } from '$lib/data/apis';
    import { likes } from '$lib/data/likes';
    import copy_icon from '$lib/assets/icons/copy.svg';
    import camera_icon from '$lib/assets/icons/camera.svg';

    let total: number | null = null;
    let params = $page.url.searchParams;

    async function load(offset: number, length: number): Promise<ComponentProps<ObjektPreview>[]> {
        if (params.has('liked')) {
            if (!$likes.length) {
                total = 0;
                return [];
            }
            
            if (!$likes[0].backgroundColor) {
                const res = await fetch(Subsquid.URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: `
                            query {
                                ${$likes.map((collection, index) => `
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

                $likes = $likes.map((c, i) => {
                    return { ...c, backgroundColor: data.data[Object.keys(data.data)[i]].edges[0].node.backgroundColor }
                });
            }

            const items = Subsquid.filterCollections($likes, params);
            total = items.length;
            return items.map(c => { return { collection: c } });
        }

        let filters: string[] = [];
        let sort = 'timestamp_DESC';
        const artists = await Cosmo.artists();

        params.forEach((value, key) => {
            switch (key) {
                case 'artist':
                    if (artists.find(a => a.name === value))
                        filters.push(`artists_containsAll: "${value}"`);
                    else if (artists.find(a => a.members.find(m => m.name === value)))
                        filters.push(`member_eq: "${value}"`);
                    else if (Cosmo.unit(value))
                        filters.push(`AND: {member_eq: "${Cosmo.unit(value)![0]}"` + Cosmo.unit(value)?.slice(1).reduce(
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

        const res = await fetch(Subsquid.URL, {
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
                                    ${Object.keys(Subsquid.Collection).join('\n')}
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

        return data.data.collectionsConnection.edges.map((e: { node: Subsquid.Collection }): ComponentProps<ObjektPreview> => { return { collection: e.node } });
    }

    onDestroy(page.subscribe(() => {
        if ([...params.entries()].toString() !== [...$page.url.searchParams.entries()].toString()) {
            total = null;
            params = $page.url.searchParams;
        }
    }));

    let _likes = $likes;
    $: if (_likes !== $likes) {
        if (params.has('liked') && _likes[0] && _likes[0].backgroundColor)
            total = null;
        _likes = $likes;
    }

    function copyLikes() {
        navigator.clipboard.writeText(Object.values($likes.reduce((acc, c) => {
            acc[c.member] = [ c, ...(acc[c.member] || []) ];
            return acc;
        }, {} as {[member: string]: Subsquid.Collection[]})).map(m => {
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
