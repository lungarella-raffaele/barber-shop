<script lang="ts">
	import DataTable from './datatable.svelte';
	import { columns } from './column';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<h1 class="title">Le tue prenotazioni</h1>

<DataTable data={data.reservations} {columns} />
