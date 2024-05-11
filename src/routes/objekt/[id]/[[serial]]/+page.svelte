<script lang="ts">
    import ObjektModal from '$lib/components/common/ObjektModal.svelte';
	import { Collection, Objekt } from '../../../../model';
    
    export let data: { id: string, serial?: number };
</script>

<ObjektModal collection={{ ...new Collection, id: data.id }} objekt={data.serial ? { ...new Objekt, serial: data.serial } : null}/>
