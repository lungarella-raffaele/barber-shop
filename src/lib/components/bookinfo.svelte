<script>
	let { name = '', email = '', phoneNumber = '', hour = '', date = '' } = $props();
</script>

<div class="sticky bottom-8 mx-96 mb-24">
	<div class="mb-4 rounded-lg px-8 py-4">
		{name}
		{email}
		{phoneNumber}
		{hour}
		{date}
	</div>
</div>
