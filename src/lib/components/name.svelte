<script>
	import Label from './generic/label.svelte';
	import Separator from './generic/separator.svelte';

	let { name = $bindable(''), email = $bindable(''), phoneNumber = $bindable('') } = $props();
</script>

<section class="mb-8 rounded-xl border bg-background-alt p-8">
	<Separator orientation="horizontal">
		<h3 class="text-3xl font-bold">Inserisci nominativo</h3>
	</Separator>
	<Label text="Nome e cognome" class="mb-8">
		<input
			type="text"
			id="name"
			name="book-name"
			bind:value={name}
			required
			class="h-10 w-[240px] rounded-md px-3 py-2"
			placeholder="Mario Rossi"
		/>
	</Label>
	<Label text="Email" class="mb-8">
		<input
			type="text"
			id="email"
			name="book-email"
			bind:value={email}
			required
			class="h-10 w-[240px] rounded-md px-3 py-2"
			placeholder="mariorossi@es.com"
		/>
	</Label>
	<Label text="Numero di telefono">
		<input
			type="text"
			id="phone-number"
			name="book-phone"
			bind:value={phoneNumber}
			required
			class="h-10 w-[240px] rounded-md px-3 py-2"
			placeholder="333"
		/>
	</Label>
</section>
