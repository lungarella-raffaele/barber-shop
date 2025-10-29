<script lang="ts">
	import type { PageProps } from './$types';
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { emailSchema } from '@schema';
	import { passwordSchema } from '@schema';
	import { getString } from '$lib/utils';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';
	import { KeyRound, Mail, Save } from '$lib/components/icons';
	import Passwordinput from '$lib/components/app/passwordinput.svelte';
	import EditButton from '$lib/components/app/editbutton.svelte';

	const { data, form }: PageProps = $props();

	if (data.updatedEmail) {
		if (data.updatedEmail.isOk()) {
			toast.success('Email aggiornata con successo!');
		} else {
			toast.error('Impossibile aggiornare la tua email. Riprova più tardi.');
		}
	}

	$effect(() => {
		if (form && !form.success) {
			toast.error('Nome obbligatorio', {
				description: `L'informazione del nome è obbligatorio per il profilo`
			});
		}
	});

	const infoBackup = {
		name: data.user.data.name,
		phoneNumber: data.user.data.phoneNumber
	};

	let isOpen = $state(false);

	const deleteAccount: SubmitFunction = () => {
		return async ({ result }) => {
			if (result.type === 'success' || result.type === 'redirect') {
				toast.success('Account eliminato');
				await invalidateAll();
				goto('/');
			} else {
				toast.error(`Impossibile eliminare l'account. Riprova più tardi.`);
			}
			isOpen = false;
		};
	};

	const changeEmail: SubmitFunction = ({ cancel, formData }) => {
		const email = getString(formData, 'email');
		const correctEmail = emailSchema.safeParse(email);

		if (!correctEmail.success) {
			toast.error('Impossibile cambiare la mail.', {
				description: 'Inserisci una mail valida.'
			});
			return cancel();
		}
		return async ({ result }) => {
			if (result.type === 'success') {
				toast.warning('Email inviata', {
					description: `Controlla la tua casella di posta: ${email}`
				});
			} else if (result.type === 'failure' && result.data) {
				toast.error('Impossibile cambiare la mail.', {
					description: result.data.message ? result.data.message : ''
				});
			}
			changeEmailDialog = false;
		};
	};

	const changePassword: SubmitFunction = ({ formData, cancel }) => {
		const newPass = formData.get('new-pass');
		const confirmPass = formData.get('confirm-pass');
		const oldPass = formData.get('confirm-pass');

		if (!newPass || !confirmPass || !oldPass) {
			toast.error('Inserisci tutte le informazioni necessarie');
			return cancel();
		}

		if (newPass !== confirmPass) {
			toast.error('La password di conferma non coincide con la nuova password');
			return cancel();
		}

		const isPasswordSafe = passwordSchema.safeParse(newPass);

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
				changePasswordDialog = false;
			} else if (result.type === 'failure' && result.data) {
				toast.error('Impossibile aggiornare la password.', {
					description: result.data.message ? result.data.message : ''
				});
			}
		};
	};

	let isEditingInfo = $state(false);

	const toggleInfoUpdate = () => {
		// If no change is made restore previous values
		if (!isEditingInfo) {
			data.user = { ...data.user, ...infoBackup };
		}
	};

	let changeEmailDialog = $state(false);
	let changePasswordDialog = $state(false);
</script>

<h1 class="title">Profilo</h1>
<Card.Root class="mb-5">
	<Card.Header>
		<Card.Title>Informazioni personali</Card.Title>
	</Card.Header>
	<Card.Content>
		<form action="?/updateInfo" method="post" class="mb-8">
			<Label for="name">Nome</Label>
			<Input
				class="mb-4"
				name="name"
				value={data.user.data.name}
				placeholder="Mario Rossi"
				disabled={!isEditingInfo}
			/>

			<Label for="name">Numero di telefono</Label>
			<Input
				class="mb-4"
				name="phone"
				value={data.user.data.phoneNumber}
				placeholder="+39 333 444 55 66"
				disabled={!isEditingInfo}
			/>

			<EditButton bind:pressed={isEditingInfo} onclick={toggleInfoUpdate} />
			<Button class="ml-2" type="submit" disabled={!isEditingInfo}><Save />Salva</Button>
		</form>

		<Label for="name">Email</Label>
		<Input
			class="mr-4"
			id="name"
			value={data.user.data.email}
			placeholder="mariorossi@example.com"
			disabled
		/>

		<div class="mt-4 flex flex-col gap-4">
			<Button type="button" onclick={() => (changeEmailDialog = !changeEmailDialog)}>
				<Mail />
				Cambia email
			</Button>

			<Button type="button" onclick={() => (changePasswordDialog = !changePasswordDialog)}>
				<KeyRound />
				Cambia password
			</Button>
		</div>
	</Card.Content>
</Card.Root>

<Card.Root class="border-destructive">
	<Card.Header>
		<Card.Title>Elimina account</Card.Title>
		<Card.Description>
			Tutte le informazioni relative al tuo profilo saranno eliminate, l'azione non è
			reversibile.
		</Card.Description>
	</Card.Header>
	<Card.Content class="mt-4 rounded-b-lg border-t border-destructive bg-red-200/15  py-4">
		<Button onclick={() => (isOpen = true)} class={buttonVariants({ variant: 'destructive' })}
			>Elimina account</Button
		>
	</Card.Content>
</Card.Root>

<AlertDialog.Root bind:open={isOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Sei sicuro?</AlertDialog.Title>
			<AlertDialog.Description>
				Tutte le tue prenotazioni, passate e future verrano eliminate
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Annulla</AlertDialog.Cancel>
			<form action="?/deleteAccount" method="post" use:enhance={deleteAccount}>
				<AlertDialog.Action class="{buttonVariants({ variant: 'destructive' })} w-full">
					Elimina account
				</AlertDialog.Action>
			</form>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<Dialog.Root bind:open={changeEmailDialog}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Cambia email</Dialog.Title>
			<Dialog.Description>
				Inserisci la nuova mail, ti verrà inviata una mail di conferma.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/changeEmail" method="post" use:enhance={changeEmail}>
			<div class="py-8">
				<Label for="name" class="text-right">Email</Label>
				<Input
					id="name"
					name="email"
					placeholder="mariorossi@example.com"
					class="col-span-3"
				/>
			</div>
			<Dialog.Footer>
				<Button
					variant="secondary"
					type="button"
					onclick={() => (changeEmailDialog = false)}
				>
					Annulla
				</Button>
				<Button type="submit">Cambia</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={changePasswordDialog}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Cambia password</Dialog.Title>
		</Dialog.Header>
		<form action="?/changePassword" method="post" use:enhance={changePassword}>
			<Label for="old-pass" class="text-right">Password attuale</Label>
			<Passwordinput name="old-pass" id="old-pass" />

			<div class="py-8">
				<Label for="new-pass">Nuova password</Label>
				<Passwordinput class="mb-4" name="new-pass" id="new-pass" />

				<Label for="confirm-pass">Conferma password</Label>
				<Passwordinput name="confirm-pass" id="confirm-pass" />
			</div>

			<Dialog.Footer>
				<Button
					variant="secondary"
					type="button"
					onclick={() => (changeEmailDialog = false)}
				>
					Annulla
				</Button>
				<Button type="submit">Cambia</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
