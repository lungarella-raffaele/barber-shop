<script>
	import DatePicker from './datepicker.svelte';
	import Hourpicker from './hourpicker.svelte';

	let { date = $bindable(), hour = $bindable() } = $props();
</script>

<DatePicker bind:value={date} />
<Hourpicker bind:value={hour} />
