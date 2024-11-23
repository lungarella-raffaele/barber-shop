<script>
	import { i18n } from '$lib/i18n';
	import { availableLanguageTags, languageTag } from '$lib/paraglide/runtime';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import { ChevronDown, Check, Earth } from 'lucide-svelte';
	import { createSelect, melt } from '@melt-ui/svelte';

	let currentPathWithoutLanguage = $derived(i18n.route($page.url.pathname));

	const options = availableLanguageTags;

	const {
		elements: { trigger, menu, option },
		states: { open },
		helpers: { isSelected }
	} = createSelect({
		forceVisible: true,
		positioning: {
			placement: 'bottom',
			fitViewport: true,
			sameWidth: false
		},
		defaultSelected: { label: languageTag(), value: languageTag() }
	});

	/** @type {import('@melt-ui/svelte').SelectOption}*/
</script>

<div class="flex flex-col justify-between">
	<button
		use:melt={$trigger}
		aria-label="Food"
		class="relative inline-flex h-10 items-center justify-center rounded-lg px-2 capitalize transition-colors hover:bg-dark-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
	>
		<Earth />
		<ChevronDown size={20} />
	</button>
	{#if $open}
		<div
			class="max-h[300px] z-10 rounded-lg bg-background-alt p-1 shadow"
			use:melt={$menu}
			transition:fade={{ duration: 150 }}
		>
			{#each options as lang}
				<div use:melt={$option({ value: lang, label: lang })} class="flex flex-row items-center">
					<a
						class="flex w-full flex-row-reverse items-center rounded px-2 py-1 capitalize hover:bg-muted"
						href={currentPathWithoutLanguage}
						hreflang={lang}
					>
						{lang}
						<div class="check mr-2 {$isSelected(lang) ? 'block' : 'hidden'}">
							<Check size={20} />
						</div>
					</a>
				</div>
			{/each}
		</div>
	{/if}
</div>
