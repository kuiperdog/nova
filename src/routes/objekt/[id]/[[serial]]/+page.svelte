<script lang="ts">
    import ObjektModal from '$lib/components/common/ObjektModal.svelte';
    import { Subsquid } from '$lib/data/apis';
    
    export let data: { id: string, serial?: number };
</script>

<ObjektModal collection={{ ...Subsquid.Collection, id: data.id }} objekt={data.serial ? { ...Subsquid.Objekt, serial: data.serial } : null}/>
