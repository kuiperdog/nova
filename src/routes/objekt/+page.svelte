<script lang="ts">
    import { onDestroy, type ComponentProps } from 'svelte';
    import { page } from '$app/stores';
    import ObjektGrid from '$lib/components/common/ObjektGrid.svelte';
	import type ObjektPreview from '$lib/components/common/ObjektPreview.svelte';
    import { subsquid } from '$lib/data/apis';
    import { Collection } from '$lib/data/types';

    let total: number | null = null;
    let params = $page.url.searchParams;

    async function load(offset: number, length: number) {
        let filters: string[] = [];
        let sort = 'timestamp_DESC';

        params.forEach((value, key) => {
            switch (key) {
                case 'artist':
                    filters.push(`artists_containsAll: "${value}"`);
                    break;
                case 'class':
                    filters.push(`class_eq: "${value}"`);
                    break;
                case 'member':
                    filters.push(`member_eq: "${value}"`);
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
                case 'physical':
                    filters.push(`number_endsWidth: "${value ? 'A' : 'Z'}"`)
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
        })

        const res = await fetch(subsquid, {
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
                                    ${Object.keys(Collection).join('\n')}
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

        return data.data.collectionsConnection.edges.map((e: { node: Collection }): ComponentProps<ObjektPreview> => {
            return {
                collectionId: e.node.id,
                collectionNo: e.node.number,
                thumbnail: e.node.thumbnail,
                textColor: e.node.textColor,
                serial: null
            };
        })
    }

    const unsubscribe = page.subscribe(() => {
        if (params !== $page.url.searchParams) {
            params = $page.url.searchParams
            total = null;
        }
    });
    onDestroy(unsubscribe);
</script>

<svelte:head>
    <title>Nova | Objekts</title>
</svelte:head>

<ObjektGrid {load} {total}/>
