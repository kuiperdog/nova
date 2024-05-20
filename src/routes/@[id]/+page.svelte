<script lang="ts">
    import { onDestroy, getContext, type ComponentProps } from 'svelte';
    import { page } from '$app/stores';
    import ObjektGrid from '$lib/components/common/ObjektGrid.svelte';
	import type ObjektPreview from '$lib/components/common/ObjektPreview.svelte';
    import { type Writable } from 'svelte/store';
    import { likedObjekts } from '$lib/utils/stores';
    import { getArtists, getUnit } from '$lib/utils/artists';
    import { filterCollections } from '$lib/utils/filters';
	import { Collection, Objekt } from '$lib/utils/model';
    import { __SUBSQUID_API__ } from '$env/static/public';

    let total: number | null = null;
    let params = $page.url.searchParams;
    const address: Writable<string> = getContext("address");

    async function load(offset: number, length: number) {
        let collectionFilters: string[] = [];
        let objektFilters: string[] = [`owner_eq: "${$address}"`];
        let sort = 'received_DESC';
        const artists = await getArtists();

        params.forEach((value, key) => {
            switch (key) {
                case 'minSerial':
                    objektFilters.push(`serial_gte: ${value}`);
                    break;
                case 'maxSerial':
                    objektFilters.push(`serial_lte: ${value}`);
                    break;
                case 'sendable':
                    objektFilters.push('transferrable_eq: true');
                    break;
                case 'sort':
                    switch (value) {
                        case 'oldest':
                            sort = 'received_ASC';
                            break;
                        case 'number':
                            sort = 'collection_number_ASC';
                            break;
                        case 'minted':
                            sort = 'minted_ASC';
                            break;
                        case 'serial':
                            sort = 'serial_ASC';
                            break;
                    }
                    break;
            }
        });

        if (params.has('liked')) {
            if (!$likedObjekts.length) {
                total = 0;
                return [];
            }

            const items = await filterCollections($likedObjekts, params);
            collectionFilters.push(`id_eq: "${items[0].id}"` + items.slice(1).reduce((acc, item, i) =>
                acc.slice(0, acc.length - i) + `, OR: {id_eq: "${item.id}"` + '}'.repeat(i + 1), ''));
        } else {
            params.forEach((value, key) => {
                switch (key) {
                    case 'artist':
                        if (artists.find(a => a.name === value))
                            collectionFilters.push(`artists_containsAll: "${value}"`);
                        else if (artists.find(a => a.members.find(m => m.name === value)))
                            collectionFilters.push(`member_eq: "${value}"`);
                        else if (getUnit(value))
                            collectionFilters.push(`AND: {member_eq: "${getUnit(value)![0]}"` + getUnit(value)?.slice(1).reduce(
                                (acc, m, i) => acc.slice(0, acc.length - i) + `, OR: {member_eq: "${m}"` + '}'.repeat(i + 1), '') + '}');
                        break;
                    case 'season':
                        collectionFilters.push(`season_eq: "${value}"`);
                        break;
                    case 'class':
                        collectionFilters.push(`class_eq: "${value}"`);
                        break;
                    case 'number':
                        collectionFilters.push(`number_startsWith: "${value}"`);
                        break;
                    case 'minNumber':
                        collectionFilters.push(`number_gte: "${value}"`);
                        break;
                    case 'maxNumber':
                        collectionFilters.push(`number_lte: "${value}"`);
                        break;
                    case 'type':
                        collectionFilters.push(`number_endsWith: "${value}"`);
                        break;
                }
            });
        }

        const res = await fetch(__SUBSQUID_API__, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: `
                    query {
                        objektsConnection(orderBy: ${sort}, first: ${length}, ${offset ? `after: "${offset}", ` : ''} where: {${objektFilters.join(', ')}, collection: {${collectionFilters.join(', ')}}}) {
                            ${ total === null ? `
                                totalCount
                            ` : `` }
                            edges {
                                node {
                                    ${Object.keys(new Objekt).filter(k => k !== 'collection').join('\n')}
                                    collection {
                                        ${Object.keys(new Collection).join('\n')}
                                    }
                                }
                            }
                        }
                    }

                `
            })
        });

        const data = await res.json();

        if (total === null)
            total = data.data.objektsConnection.totalCount;

        return data.data.objektsConnection.edges.map((e: any): ComponentProps<ObjektPreview> => {
            return {
                objekt: e.node,
                collection: e.node.collection
            }
        });
    }

    onDestroy(page.subscribe(() => {
        if ([...params.entries()].toString() !== [...$page.url.searchParams.entries()].toString()) {
            params = $page.url.searchParams;
            total = null;
        }
    }));

    let _likes = $likedObjekts;
    $: if (_likes !== $likedObjekts) {
        _likes = $likedObjekts;
        if (params.has('liked'))
            total = null;
    }
</script>

<ObjektGrid {load} {total} profile/>
