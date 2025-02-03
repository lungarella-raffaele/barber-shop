<script lang="ts">
	import * as Alert from '$lib/components/ui/alert';
	import Button from '$lib/components/ui/button/button.svelte';

	import { CircleAlert, LoaderCircle } from '$lib/components/icons/index';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { login } from '$lib/schemas/login';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { ActionData, PageData } from './$types';
	import Passwordinput from '$lib/components/app/passwordinput.svelte';

	let { form, data: pageData }: { form: ActionData; data: PageData } = $props();

	const sForm = superForm(pageData.form, {
		validators: zodClient(login)
	});

	const { form: formData, enhance, delayed } = sForm;
</script>

{#if form && form.message}
	<Alert.Root variant="destructive" class="mb-3">
		<CircleAlert class="size-4" />
		<Alert.Description>{form.message}</Alert.Description>
	</Alert.Root>
{/if}

<form method="post" use:enhance>
	<Card.Root>
		<Card.Header>
			<Card.Title>Log in</Card.Title>
			<Card.Description>Bentornato! Accedi per continuare.</Card.Description>
		</Card.Header>
		<Card.Content>
			<Form.Field form={sForm} name="email">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Email</Form.Label>
						<Input {...props} bind:value={$formData.email} placeholder="Inserisci il tua nome" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field form={sForm} name="password">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Passwords</Form.Label>
						<Passwordinput
							{...props}
							bind:value={$formData.password}
							placeholder="Inserisci la tua password"
						></Passwordinput>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</Card.Content>

		<Card.Footer>
			<div class="flex w-full flex-col">
				<Button disabled={$delayed} class="mt-6 w-full" type="submit" onclick={() => (form = null)}>
					{#if !$delayed}
						Login
					{:else}
						<LoaderCircle class="animate-spin" />
						Please wait
					{/if}
				</Button>
				<p class="mt-3">
					Non hai un account?
					<a class="underline" href="/signup" aria-label="Sign up">Registrati</a>
				</p>
			</div>
		</Card.Footer>
	</Card.Root>
</form>
