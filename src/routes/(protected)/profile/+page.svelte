<script lang="ts">
	import Profile from './Profile.svelte';
	import { toast } from 'svelte-sonner';
	import type { PageProps } from './$types';

	const { data, form }: PageProps = $props();

	$effect(() => {
		if (form && !form.success) {
			toast.error('Nome obbligatorio', {
				description: `L'informazione del nome è obbligatorio per il profilo`
			});
		}
	});
</script>

{#if data.user}
	<Profile user={data.user} />
{/if}
