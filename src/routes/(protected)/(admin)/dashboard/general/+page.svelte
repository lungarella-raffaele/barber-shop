<script lang="ts">
	import KindsManager from './kindsmanager.svelte';
	import { Save } from '$lib/components/icons/index';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import { Switch } from '$lib/components/ui/switch';
	import { toast } from 'svelte-sonner';
	import type { PageProps } from './$types';
	import { enhance } from '$app/forms';

	const { data, form }: PageProps = $props();

	let message = $state(data.banner?.message ?? '');
	let visible = $state(data.banner?.visible ?? false);

	const saveDisabled = $derived(
		message === data.banner?.message && visible === data.banner.visible
	);

	const isStaffActive = $derived(data.user.data.isActive ?? false);

	$effect(() => {
		if (form && !form.success && form.isUpdatingKind) {
			toast.error('Controlla i dati inseriti.');
		}
	});
</script>

<svelte:head>
	<meta
		name="description"
		content="Visualizza tutte le prenotazioni relative ad un determinato giorno."
	/>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<h2 class="mb-2 text-lg font-bold">Banner</h2>
<form method="post" action="?/updateBanner">
	<Input
		bind:value={message}
		name="message"
		placeholder="Banner da inserire"
		type="textarea"
		class="mb-4"
	/>

	<div class="flex items-center space-x-2">
		<Switch bind:checked={visible} name="visible" id="banner-visibility" />
		<Label class="mb-0" for="banner-visibility">Visibilità banner</Label>
	</div>
	<Button class="mt-4" disabled={saveDisabled} type="submit">
		<Save />
		Salva
	</Button>
</form>

<Separator class="my-8" />

<KindsManager kinds={data.kinds} />

<Separator class="my-8" />

<h2 class="mb-2 text-lg font-bold">Stato utenza</h2>
<form action="?/toggleStaff" method="POST" use:enhance>
	<div class="flex items-center">
		<input type="hidden" value={data.user.data.id} name="id" />
		<Switch type="submit" checked={isStaffActive} name="active" />
		<Label class="mb-0">
			{#if isStaffActive}
				Attivo
			{:else}
				Disattivo
			{/if}
		</Label>
	</div>
</form>
