<script>
	import { Button } from '$lib/components/ui/button';
	const { user, success, error } = $props();
</script>

<div
	class="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12 lg:max-w-4xl lg:px-8 lg:py-16 xl:max-w-6xl"
>
	<article
		class="prose prose-sm mx-auto text-center dark:prose-invert sm:prose-base lg:prose-lg xl:prose-xl 2xl:prose-2xl"
	>
		<div class="flex flex-col items-center text-center">
			{#if success}
				<h2>Benvenuto {user.name}, hai correttamente verificato la tua mail</h2>
			{:else if error === 'not_pending'}
				<h2>Ciao {user.name}</h2>
			{:else}
				daje
			{/if}
		</div>
		<Button href="/">Home</Button>
		<Button href="/">Prenota</Button>
		<Button href="/">Profilo</Button>
	</article>
</div>
