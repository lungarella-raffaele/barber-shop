<script>
	import Footer from '$components/footer.svelte';
	import MenuBar from '$components/menubar.svelte';
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { ModeWatcher } from 'mode-watcher';

	import '../app.css';

	/** @type {{children: import('svelte').Snippet}} */
	let { children } = $props();
</script>

<ParaglideJS {i18n}>
	<MenuBar />
	<main class="my-8 px-8 md:px-24 lg:px-80">
		<ModeWatcher />
		{@render children()}
		<Footer />
	</main>
</ParaglideJS>
