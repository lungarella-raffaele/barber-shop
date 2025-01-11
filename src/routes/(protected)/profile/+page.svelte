<script lang="ts">
	import Profile from '$lib/components/app/profile.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

{#if data.user}
	<Profile user={data.user} />
{/if}
