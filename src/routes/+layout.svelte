<script>
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import '../app.css';
	import Footer from '$components/footer.svelte';

	/** @type {{children: import('svelte').Snippet}} */
	let { children } = $props();
</script>

<ParaglideJS {i18n}>
	<main class="align-center flex flex-col">
		{@render children()}
		<Footer />
	</main>
</ParaglideJS>
