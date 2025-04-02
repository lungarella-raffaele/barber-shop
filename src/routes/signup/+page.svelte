<script lang="ts">
	import { goto } from '$app/navigation';
	import PasswordInput from '$lib/components/app/passwordinput.svelte';
	import { CircleAlert, LoaderCircle } from '$lib/components/icons/index';
	import * as Alert from '$lib/components/ui/alert/';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { signup } from '$lib/schemas/signup';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	const sForm = superForm(data.form, {
		validators: zodClient(signup),
		onUpdated({ form }) {
			if (form.message) {
				if (form.message.success) {
					toast.warning('Email di verifica', { description: form.message.text });
					goto('/');
				} else {
					showAlert = true;
					alertMessage = form.message.text;
				}
			}
		}
	});

	const { form: formData, enhance, delayed } = sForm;

	function focus(node: HTMLDivElement) {
		node.scrollIntoView({
			behavior: 'smooth',
			block: 'center'
		});
	}
	let showAlert = $state(false);
	let alertMessage = $state('');
</script>

{#if showAlert}
	<Alert.Root variant="destructive" class="mb-3">
		<div use:focus>
			<CircleAlert class="size-4" />
			<Alert.Description>{alertMessage}</Alert.Description>
		</div>
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
						<Input
							{...props}
							bind:value={$formData.email}
							placeholder="mariorossi@esempio.com"
						/>
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
						Attendi
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
