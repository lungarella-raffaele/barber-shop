<script lang="ts">
	import { enhance } from '$app/forms';
	import { BARBER_SHOP_DETAILS } from '$lib/constants';
	import { newPasswordSchema } from '@schema';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';
	import Button from '../ui/button/button.svelte';
	import Label from '../ui/label/label.svelte';
	import Passwordinput from './passwordinput.svelte';

	const { id, error, success } = $props();

	const changePassword: SubmitFunction = ({ formData, cancel }) => {
		const newPass = formData.get('new-pass');
		const confirmPass = formData.get('confirm-pass');

		if (!newPass || !confirmPass) {
			toast.error('Inserisci tutte le informazioni necessarie');
			return cancel();
		}

		if (newPass !== confirmPass) {
			toast.error('La password di conferma non coincide con la nuova password');
			return cancel();
		}

		const isPasswordSafe = newPasswordSchema.safeParse({ password: newPass });

		if (!isPasswordSafe.success) {
			toast.error('La password inserita è troppo semplice', {
				description:
					'Deve contenere minimo 8 caratteri, un carattere speciale e un carattere maiuscolo'
			});
			return cancel();
		}

		return async ({ result }) => {
			if (result.type === 'success') {
				toast.success('Password aggiornata con successo!');
			} else if (result.type === 'failure' && result.data) {
				toast.error('Non è stato possibile aggiornare la password', {
					description: result.data.message ? result.data.message : ''
				});
			}
		};
	};
</script>

<div
	class="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12 lg:max-w-4xl lg:px-8 lg:py-16 xl:max-w-6xl"
>
	<article
		class="prose prose-sm mx-auto dark:prose-invert sm:prose-base lg:prose-lg xl:prose-xl 2xl:prose-2xl"
	>
		<div class="flex flex-col items-center text-center">
			{#if success}
				<h2>Inserisci la nuova password</h2>
			{:else if error === 'expired'}
				<h2>La richiesta è scaduta, prova a crearne una nuova</h2>
			{:else if error === 'server_error'}
				C'è stato un problema, riprova oppure chiama il numero {BARBER_SHOP_DETAILS.phone}
			{/if}
		</div>
		{#if success}
			<div class="w-full rounded-md border p-4 shadow">
				<form action="?/changePassword" method="post" use:enhance={changePassword}>
					<Label for="new-pass">Nuova password</Label>
					<Passwordinput
						class="mb-4"
						placeholder="Inserisci la nuova password"
						name="new-pass"
						id="new-pass"
					/>

					<Label for="confirm-pass">Conferma password</Label>
					<Passwordinput
						name="confirm-pass"
						id="confirm-pass"
						placeholder="Conferma password"
					/>

					<input type="hidden" value={id} name="recover-id" />
					<div class="text-end">
						<Button type="submit" class="mt-8">Cambia password</Button>
					</div>
				</form>
			</div>
		{:else if error === 'expired'}
			<p class="text-center">
				La richiesta dell'aggiornamento è scaduta, prova ad effettuarne una nuova <a
					href="/login">qui</a
				>.
			</p>
		{:else}
			<p class="text-center">
				C'è stato un problema, riprova oppure chiama il numero {BARBER_SHOP_DETAILS.phone}
			</p>
		{/if}
	</article>
</div>
