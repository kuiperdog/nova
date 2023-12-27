<script lang="ts">
	import { goto, replaceState } from '$app/navigation';
    import { Subsquid } from '$lib/data/apis';

    export let data: { id: string, serial: number };

    goto('/objekt').then(() => {
        replaceState(`/objekt/${data.id}/${data.serial}`, {
            collection: { ...Subsquid.Collection, id: data.id },
            objekt: { ...Subsquid.Objekt, serial: data.serial },
            previous: '/objekt'
        });
    });
</script>