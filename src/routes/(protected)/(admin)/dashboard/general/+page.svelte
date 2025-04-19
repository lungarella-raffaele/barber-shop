<script lang="ts">
	import ServicesManagement from '$lib/components/app/servicesmanagement.svelte';
	import { Save } from '$lib/components/icons/index';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import { Switch } from '$lib/components/ui/switch';
	import { toast } from 'svelte-sonner';
	import type { PageProps } from './$types';

	const { data, form }: PageProps = $props();

	let message = $state(data.banner?.message ?? '');
	let visible = $state(data.banner?.visible ?? false);

	const saveDisabled = $derived(
		message === data.banner?.message && visible === data.banner.visible
	);

	$effect(() => {
		if (form && form.success) {
			toast.success('Servizio Aggiornato');
		} else if (form) {
			toast.error('Il servizio non è stato aggiornato correttamente, contatta Raffaele');
		}
	});
</script>

<h2 class="mb-4 text-2xl font-bold">Banner</h2>
<form method="post" action="/updateBanner">
	<Input
		bind:value={message}
		name="message"
		placeholder="Banner da inserire"
		type="textarea"
		class="mb-4"
	/>

	<div class="flex items-center space-x-2">
		<Switch bind:checked={visible} name="visible" id="banner-visibility" />
		<Label for="banner-visibility">Visibilità banner</Label>
	</div>
	<Button class="mt-4" disabled={saveDisabled} type="submit">
		<Save />
		Salva
	</Button>
</form>

<Separator class="my-8" />

<ServicesManagement services={data.services} />
