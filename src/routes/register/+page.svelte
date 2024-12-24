<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { loginSchema } from '$lib/schema/login';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { ActionData, PageData } from './$types';

	let { data: pageData }: { form: ActionData; data: PageData } = $props();

	const sForm = superForm(pageData.form, {
		validators: zodClient(loginSchema)
	});

	const { form: formData, enhance } = sForm;
</script>

<h1 class="text-center text-3xl font-bold">Register</h1>
<form method="post" use:enhance>
	<Form.Field form={sForm} name="email">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Nome</Form.Label>
				<Input {...props} bind:value={$formData.email} placeholder="Inserisci la tua username" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field form={sForm} name="password">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Nome</Form.Label>
				<Input {...props} bind:value={$formData.password} placeholder="Inserisci la tua password" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Button type="submit">Register</Button>
</form>
