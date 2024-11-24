<script>
	import { page } from '$app/stores';
	import { i18n } from '$lib/i18n';
	import { availableLanguageTags, getLanguageFromTag, languageTag } from '$lib/paraglide/runtime';
	import { createSelect, melt } from '@melt-ui/svelte';
	import { ChevronDown, CircleCheckBig, Earth } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

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
		<ChevronDown size={18} class="ml-1 transition-all {$open ? '-scale-y-100' : ''} " />
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
						class="flex w-[130px] items-center justify-between rounded px-2 py-1 capitalize {$isSelected(
							lang
						)
							? 'bg-accent text-background'
							: 'hover:bg-muted '}"
						href={currentPathWithoutLanguage}
						hreflang={lang}
					>
						<div class="flex flex-row items-center">
							<div class="mr-2 w-[15px]">
								<CircleCheckBig size={15} class={$isSelected(lang) ? 'block' : 'hidden'} />
							</div>
							{getLanguageFromTag(lang)}
						</div>
						<span class="text-muted-foreground">{lang}</span>
					</a>
				</div>
			{/each}
		</div>
	{/if}
</div>
