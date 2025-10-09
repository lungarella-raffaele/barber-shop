<script lang="ts">
	import { goto } from '$app/navigation';
	import PasswordInput from '$lib/components/app/PasswordInput.svelte';
	import { LoaderCircle } from '$lib/components/icons/index';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { signupSchema } from '@schema';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	const sForm = superForm(data.form, {
		validators: zodClient(signupSchema),
		onUpdated({ form }) {
			if (form.message) {
				if (form.message.success) {
					toast.warning('Email di verifica', {
						description: form.message.text,
						duration: 4000
					});
					goto('/');
				} else {
					toast.error(`C'è stato un errore`, { description: form.message.text });
				}
			}
		}
	});

	const { form: formData, enhance, delayed } = sForm;
</script>

<svelte:head>
	<meta name="description" content="Registrati al sito." />
</svelte:head>
<form method="post" use:enhance>
	<Card.Root>
		<Card.Header>
			<Card.Title>Sign up</Card.Title>
			<Card.Description
				>La registrazione ti consente di saltare uno step durante la prenotazione, poiché i
				nominativi associati saranno automaticamente quelli inseriti nel tuo profilo. Puoi
				eliminare l'account in qualsiasi momento e non conserveremo alcuna informazione
				fornita durante la registrazione.
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<!--email -->
			<Form.Field form={sForm} name="email">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Email</Form.Label>
						<Input
							autocomplete="email"
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
						<Input
							{...props}
							bind:value={$formData.name}
							placeholder="Nome"
							autocomplete="name"
						/>
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
