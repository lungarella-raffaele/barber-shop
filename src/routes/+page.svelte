<script>
	import Calendar from '$components/calendar.svelte';
	import Name from '$components/name.svelte';
	import Hourpicker from '$components/hourpicker.svelte';
	import Button from '$components/generic/button.svelte';
	import Servicepicker from '$components/servicepicker.svelte';

	import { Send } from '$icons';
	import { enhance } from '$app/forms';

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
		<h1 class="text-4xl font-bold">Prenota il tuo appuntamento</h1>
		<Name bind:name bind:email bind:phoneNumber />
		<Calendar bind:date />
		<Hourpicker bind:hour />
		<Servicepicker />

		<div class="flex flex-row-reverse">
			<Button>
				Submit
				<Send class="ml-2" size={20} />
			</Button>
		</div>
	</form>
</section>
