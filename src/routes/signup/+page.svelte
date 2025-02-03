<script lang="ts">
	import { CircleAlert, LoaderCircle } from '$lib/components/icons/index';
	import * as Alert from '$lib/components/ui/alert/';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { signup } from '$lib/schemas/signup';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { ActionData, PageData } from './$types';
	import PasswordInput from '$lib/components/app/passwordinput.svelte';

	let { form, data: pageData }: { form: ActionData; data: PageData } = $props();

	const sForm = superForm(pageData.form, {
		validators: zodClient(signup)
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
			<Card.Title>Sign up</Card.Title>
			<Card.Description>Benvenuto! Registrati per prenotare più velocemente</Card.Description>
		</Card.Header>
		<Card.Content>
			<!--email -->
			<Form.Field form={sForm} name="email">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Email</Form.Label>
						<Input {...props} bind:value={$formData.email} placeholder="mariorossi@esempio.com" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<!--password -->
			<Form.Field form={sForm} name="password">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Password</Form.Label>

						<PasswordInput
							{...props}
							bind:value={$formData.password}
							placeholder="Inserisci la tua password"
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field form={sForm} name="confirmPassword">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Conferma password</Form.Label>

						<PasswordInput
							{...props}
							bind:value={$formData.confirmPassword}
							placeholder="Conferma la tua password"
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Separator class="my-5" />

			<!--name -->
			<Form.Field form={sForm} name="name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Nome</Form.Label>
						<Input {...props} bind:value={$formData.name} placeholder="Nome" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<!--phone number -->
			<Form.Field form={sForm} name="phoneNumber">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Numero di telefono</Form.Label>
						<Input
							{...props}
							bind:value={$formData.phoneNumber}
							placeholder="Inserisci il tuo numero"
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</Card.Content>
		<Card.Footer>
			<div class="flex w-full flex-col">
				<Button disabled={$delayed} class="mt-6 w-full" type="submit">
					{#if !$delayed}
						Register
					{:else}
						<LoaderCircle class="animate-spin" />
						Please wait
					{/if}
				</Button>
				<p class="mt-3">
					Hai già un account?
					<a class="underline" href="/login" aria-label="Login">Entra</a>
				</p>
			</div>
		</Card.Footer>
	</Card.Root>
</form>
