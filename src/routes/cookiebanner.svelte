<script>
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';

	let isBannerVisible = false;

	function dismiss() {
		isBannerVisible = false;
		localStorage.setItem('areCookieAccepted', 'true');
	}

	onMount(() => {
		const hasAccepted = localStorage.getItem('areCookieAccepted') === 'true';
		if (hasAccepted) {
			isBannerVisible = false;
		} else {
			isBannerVisible = true;
		}
	});
</script>

{#if isBannerVisible}
	<div class="cookie-banner flex w-full flex-row-reverse">
		<div class="m-4 flex w-[500px] rounded-lg border bg-foreground bg-opacity-90">
			<div class="p-4 text-xs">
				<p class="text-background">
					Questo sito utilizza esclusivamente cookie tecnici necessari per
					l'autenticazione e la gestione della sessione utente. Questi cookie sono
					essenziali per il funzionamento del sito e hanno una durata di 30 giorni.
				</p>
				<div class="mt-3 flex flex-row-reverse items-center">
					<Button class="text-xs" variant="secondary" onclick={dismiss}>Ho capito</Button>
					<Button class="text-xs text-background" variant="link" href="/cookies"
						>Cookie policy</Button
					>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.cookie-banner {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 1000;
		font-family: Arial, sans-serif;
		margin-bottom: 4rem;
	}

	p {
		margin: 0;
		line-height: 1.5;
	}
</style>
