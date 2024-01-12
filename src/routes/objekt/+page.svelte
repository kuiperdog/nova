<script lang="ts">
    import { onDestroy, type ComponentProps } from 'svelte';
    import { page } from '$app/stores';
    import ObjektGrid from '$lib/components/common/ObjektGrid.svelte';
	import type ObjektPreview from '$lib/components/common/ObjektPreview.svelte';
    import { Subsquid, Cosmo } from '$lib/data/apis';

    let total: number | null = null;
    let params = $page.url.searchParams;

    async function load(offset: number, length: number): Promise<ComponentProps<ObjektPreview>[]> {
        if (params.has('liked')) {
            let liked: Subsquid.Collection[] = JSON.parse(window.localStorage.getItem('bookmarks') || '[]');
            if (!liked.length)
                return [];
            
            if (!liked[0].backgroundColor) {
                const res = await fetch(Subsquid.URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: `
                            query {
                                ${liked.map((collection, index) => `
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

                for (let i = 0; i < Object.keys(data.data).length; i++) {
                    liked[i].backgroundColor = data.data[Object.keys(data.data)[i]].edges[0].node.backgroundColor;
                }

                window.localStorage.setItem('bookmarks', JSON.stringify(liked));
            }

            liked = Subsquid.filterCollections(liked, params);
            total = liked.length;

            return liked.map(c => { return { collection: c } });
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
        if (params !== $page.url.searchParams) {
            total = null;
            params = $page.url.searchParams;
        }
    }));
</script>

<ObjektGrid {load} {total}/>
