<script>
	import * as Alert from '$lib/components/ui/alert';
	const { message } = $props();
</script>

<Alert.Root class="mb-3 rounded-[5px] bg-blue-500 p-2">
	<Alert.Description>{message}</Alert.Description>
</Alert.Root>
