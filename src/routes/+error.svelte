<script>
	import { page } from '$app/state';
</script>

<div class="flex h-full flex-col justify-center text-center">
	<h1 class="mb-8 text-9xl font-bold text-primary">{page.status}</h1>
	<h3 class="text-2xl">
		{page.error?.message}
	</h3>
</div>
