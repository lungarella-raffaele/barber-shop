<script>
	import Calendar from '$components/calendar.svelte';
	import Label from '$components/label.svelte';
	import { enhance } from '$app/forms';

	/** @type {string} */
	let name = $state('');

	/** @type {string} */
	let email = $state('');

	/** @type {import("@internationalized/date").DateValue | undefined}*/
	let date = $state(undefined);

	/** @type {import('./$types').SubmitFunction}*/
	const handleSubmit = ({ formData }) => {
		formData.append('book-date', JSON.stringify(date));
		return async ({ result, update }) => {
			await update();
			if (result.type === 'success') {
				console.log('okay');
			}
		};
	};
</script>

<section class="prose">
	<form method="post" use:enhance={handleSubmit}>
		<h3>Inserisci nominativo</h3>
		<Label text="Nome">
			<input
				type="text"
				id="name"
				name="book-name"
				bind:value={name}
				required
				class="h-10 w-[240px] rounded-md bg-white px-3 py-2"
				placeholder="johndoe@example.com"
			/>
		</Label>
		<h3>Inserisci Email</h3>
		<Label text="Email">
			<input
				type="text"
				id="email"
				name="book-email"
				bind:value={email}
				required
				class="h-10 w-[240px] rounded-md bg-white px-3 py-2"
				placeholder="Nome"
			/>
		</Label>
		<h3>Scegli la data</h3>
		<Calendar bind:date />
		<button type="submit">Submit</button>
	</form>
</section>
