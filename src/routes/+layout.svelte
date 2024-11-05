<script>
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import '../app.css';
	import Footer from '$components/footer.svelte';
	import { ModeWatcher } from 'mode-watcher';

	/** @type {{children: import('svelte').Snippet}} */
	let { children } = $props();
</script>

<ParaglideJS {i18n}>
	<main class="px-8 md:px-24 lg:px-80">
		<ModeWatcher />
		{@render children()}
		<Footer />
	</main>
</ParaglideJS>

