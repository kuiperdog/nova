<script lang="ts">
    import { onDestroy, getContext, type ComponentProps } from 'svelte';
    import { page } from '$app/stores';
    import ObjektGrid from '$lib/components/common/ObjektGrid.svelte';
	import type ObjektPreview from '$lib/components/common/ObjektPreview.svelte';
    import { Subsquid, Cosmo } from '$lib/data/apis';
    import { type Writable } from 'svelte/store';

    let total: number | null = null;
    let params = $page.url.searchParams;
    const address: Writable<string> = getContext("address");

    async function load(offset: number, length: number) {
        let collectionFilters: string[] = [];
        let objektFilters: string[] = [`owner_eq: "${$address}"`];
        let sort = 'received_DESC';
        const artists = await Cosmo.artists();

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
            if (!window.localStorage.getItem('bookmarks')) {
                total = 0;
                return [];
            }

            const likes = Subsquid.filterCollections(JSON.parse(window.localStorage.getItem('bookmarks') || '[]'), params);
            collectionFilters.push(`id_eq: "${likes[0].id}"` + likes.slice(1).reduce((acc, item, i) =>
                acc.slice(0, acc.length - i) + `, OR: {id_eq: "${item.id}"` + '}'.repeat(i + 1), ''));
        } else {
            params.forEach((value, key) => {
                switch (key) {
                    case 'artist':
                        if (artists.find(a => a.name === value))
                            collectionFilters.push(`artists_containsAll: "${value}"`);
                        else if (artists.find(a => a.members.find(m => m.name === value)))
                            collectionFilters.push(`member_eq: "${value}"`);
                        else if (Cosmo.unit(value))
                            collectionFilters.push(`AND: {member_eq: "${Cosmo.unit(value)![0]}"` + Cosmo.unit(value)?.slice(1).reduce(
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

        const res = await fetch(Subsquid.URL, {
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
                                    ${Object.keys(Subsquid.Objekt).join('\n')}
                                    collection {
                                        ${Object.keys(Subsquid.Collection).join('\n')}
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
        if (params !== $page.url.searchParams) {
            params = $page.url.searchParams;
            total = null;
        }
    }));
</script>

<ObjektGrid {load} {total} profile/>
