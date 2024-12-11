<script lang="ts">
	import * as Form from '$lib/components/ui/form/index';
	import { Input } from '$lib/components/ui/input';
	import { bookSchema, type FormSchema } from '$lib/schema/book';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Card from '$lib/components/ui/card/index';

	let { data, class: className = '' }: { data: SuperValidated<Infer<FormSchema>>; class?: string } =
		$props();

	const form = superForm(data, {
		validators: zodClient(bookSchema)
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
	<Card.Root class={className}>
		<Card.Header>
			<Card.Title>Prenota un appuntamento</Card.Title>
			<Card.Description>Prenota un'appuntamento da Emis barber shop</Card.Description>
		</Card.Header>
		<Card.Content>
			<Form.Field {form} name="name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Nome</Form.Label>
						<Input {...props} bind:value={$formData.name} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="surname">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Cognome</Form.Label>
						<Input {...props} bind:value={$formData.cognome} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="phoneNumber">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Numero di telefono</Form.Label>
						<Input {...props} bind:value={$formData.phoneNumber} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="email">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>E-mail</Form.Label>
						<Input {...props} bind:value={$formData.email} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</Card.Content>
		<Card.Footer>
			<Form.Button>Submit</Form.Button>
		</Card.Footer>
	</Card.Root>
</form>
