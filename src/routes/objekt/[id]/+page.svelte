<script lang="ts">
	import { goto, replaceState } from '$app/navigation';
    import { Subsquid } from '$lib/data/apis';

    export let data: { id: string };

    goto('/objekt').then(() => {
        replaceState(`/objekt/${data.id}`, { collection: { ...Subsquid.Collection, id: data.id }, objekt: null, previous: '/objekt' });
    });
</script>