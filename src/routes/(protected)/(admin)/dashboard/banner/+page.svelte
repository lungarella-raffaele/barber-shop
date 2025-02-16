<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();

	let message = $state(data.banner?.message ?? '');
	let visible = $state(data.banner?.visible ?? false);

	const saveDisabled = $derived(
		message === data.banner?.message && visible === data.banner.visible
	);
</script>

<form method="post">
	<Input
		bind:value={message}
		name="message"
		placeholder="Banner da inserire"
		type="textarea"
		class="mb-4"
	/>

	<div class="flex items-center space-x-2">
		<Switch bind:checked={visible} name="visible" id="airplane-mode" />
		<Label for="airplane-mode">Visibilità banner</Label>
	</div>
	<Button class="mt-4" disabled={saveDisabled} type="submit">Salva</Button>
</form>
