<script lang="ts">
	import * as Alert from '$lib/components/ui/alert';
	import Button from '$lib/components/ui/button/button.svelte';

	import Passwordinput from '$lib/components/app/passwordinput.svelte';
	import { CircleAlert, CircleCheckBig, LoaderCircle } from '$lib/components/icons/index';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label/index.js';
	import { login } from '@schema';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { ActionData, PageData } from './$types';

	let { form, data }: { form: ActionData; data: PageData } = $props();

	const sForm = superForm(data.form, {
		validators: zodClient(login)
	});

	const { form: formData, enhance, delayed } = sForm;

	let open = $state(false);
	const toggleRecoverPassword = () => {
		open = !open;
	};
</script>

{#if form && form.message}
	<Alert.Root
		variant={form.success ? 'success' : 'destructive'}
		class="align mb-3 flex items-center"
	>
		{#if form.success}
			<CircleCheckBig class="size-4" />
		{:else}
			<CircleAlert class="size-4" />
		{/if}
		<Alert.Description>{form.message}</Alert.Description>
	</Alert.Root>
{/if}

<svelte:head>
	<meta name="description" content="Accedi al tuo account." />
</svelte:head>

<form method="post" use:enhance action="?/login">
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
						<Input
							autocomplete="email"
							{...props}
							bind:value={$formData.email}
							placeholder="Inserisci la tua email"
						/>
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
				<Button
					disabled={$delayed}
					class="mt-6 w-full"
					type="submit"
					onclick={() => (form = null)}
				>
					{#if !$delayed}
						Login
					{:else}
						<LoaderCircle class="animate-spin" />
						Attendi
					{/if}
				</Button>
				<p class="mt-4 text-sm text-muted-foreground">
					Non hai un account?

					<Button
						onclick={toggleRecoverPassword}
						class="text-underline m-0 p-0 text-white"
						href="/signup"
						aria-label="Sign up"
						variant="link"
					>
						Registrati
					</Button>
				</p>

				<p class="text-sm text-muted-foreground">
					Password dimenticata?
					<Button
						onclick={toggleRecoverPassword}
						class="text-underline m-0 p-0 text-white"
						variant="link"
						aria-label="Recover password">Recupera password</Button
					>
				</p>
			</div>
		</Card.Footer>
	</Card.Root>
</form>

<Dialog.Root {open}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Recupera password</Dialog.Title>
			<Dialog.Description
				>Per recuperare la password inserisci la mail del tuo account. Ti verrà inviata una
				mail.</Dialog.Description
			>
		</Dialog.Header>

		<form method="post" action="?/recoverPassword">
			<div class="grid gap-4 py-4">
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="email" class="mb-0 text-right">Email</Label>
					<Input
						id="email"
						name="email"
						class="col-span-3"
						placeholder="Email del tuo account"
					/>
				</div>
			</div>
			<Dialog.Footer>
				<Button type="submit">Invia</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
