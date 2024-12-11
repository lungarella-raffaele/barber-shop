<script lang="ts">
	import type { PageData } from './$types';
	import BookForm from './BookForm.svelte';

	let { data }: { data: PageData } = $props();
</script>

<div class="p-20">
	<BookForm data={data.form} />
</div>
