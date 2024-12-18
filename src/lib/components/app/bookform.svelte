<script lang="ts">
	import * as Form from '$lib/components/ui/form/index';
	import { Input } from '$lib/components/ui/input';
	import { bookSchema, type FormSchema } from '$lib/schema/book';
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { data, class: className = '' }: { data: SuperValidated<Infer<FormSchema>>; class?: string } =
		$props();

	const form = superForm(data, {
		validators: zodClient(bookSchema)
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
	<Form.Field {form} name="name">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Nome</Form.Label>
				<Input {...props} bind:value={$formData.name} placeholder="Inserisci il tuo nome" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="surname">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Cognome</Form.Label>
				<Input {...props} bind:value={$formData.surname} placeholder="Inserisci il tuo cognome" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="phoneNumber">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Numero di telefono</Form.Label>
				<Input
					{...props}
					bind:value={$formData.phoneNumber}
					placeholder="Inserisci il tuo numero di telefono"
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="email">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>E-mail</Form.Label>
				<Input {...props} bind:value={$formData.email} placeholder="Inserisci la tua email" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
</form>
