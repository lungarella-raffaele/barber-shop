<script>
	import Calendar from '$components/calendar.svelte';
	import Hourpicker from '$components/hourpicker.svelte';
	import Name from '$components/name.svelte';
	import Servicepicker from '$components/servicepicker.svelte';

	import { enhance } from '$app/forms';

	import * as m from '$lib/paraglide/messages.js';

	/** @type {string} */
	let name = $state('');

	/** @type {string} */
	let email = $state('');

	/** @type {string}*/
	let phoneNumber = $state('');

	/** @type {import("@internationalized/date").CalendarDate | undefined}*/
	let date = $state(undefined);

	/** @type string*/
	let hour = $state('');

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

<section>
	<form method="post" use:enhance={handleSubmit}>
		<h1 class="mb-6 text-4xl font-bold">{m.proof_tiny_okapi_aim()}</h1>
		<Name bind:name bind:email bind:phoneNumber />
		<Calendar bind:date />
		<Hourpicker bind:hour />
		<Servicepicker />
	</form>
</section>
