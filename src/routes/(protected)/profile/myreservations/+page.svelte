<script lang="ts">
	import DataTable from '$lib/components/app/datatable/datatable.svelte';
	import { columns } from '$lib/components/app/datatable/column';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
</script>

<h1 class="title">Le tue prenotazioni</h1>

<DataTable data={data.reservations} {columns} />
