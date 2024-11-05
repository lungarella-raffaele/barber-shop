<script>
	import Calendar from '$components/calendar.svelte';
	import Name from '$components/name.svelte';
	import Modeswitch from '$components/modeswitch.svelte';
	import Hourpicker from '$components/hourpicker.svelte';
	import { Send } from '$icons';
	import { enhance } from '$app/forms';
	import Button from '$components/generic/button.svelte';

	/** @type {string} */
	let name = $state('');

	/** @type {string} */
	let email = $state('');

	/** @type {string}*/
	let phoneNumber = $state('');

	/** @type {import("@internationalized/date").CalendarDate | undefined}*/
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

<Modeswitch />
<section>
	<form method="post" use:enhance={handleSubmit}>
		<Name {name} {email} {phoneNumber} />
		<Calendar bind:date />
		<Hourpicker />
		<ServicePicker />

		<div class="flex flex-row-reverse">
			<Button>
				Submit
				<Send class="ml-2" size={20} />
			</Button>
		</div>
	</form>
</section>

<div class="sticky bottom-8 mx-96 mb-24">
	<div class="mb-4 rounded-lg bg-accent-foreground px-8 py-4">Questo div sara sempre presente</div>
</div>
