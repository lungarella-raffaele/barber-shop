<script>
	import { onMount } from 'svelte';
	import Button from '../ui/button/button.svelte';

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
	<div class="cookie-banner m-4 rounded-lg border bg-foreground">
		<div class="p-4">
			<p class="text-background">
				Questo sito utilizza esclusivamente cookie tecnici necessari per l'autenticazione e
				la gestione della sessione utente. Questi cookie sono essenziali per il
				funzionamento del sito e hanno una durata di 30 giorni.
			</p>
			<div class="flex flex-row-reverse items-center">
				<Button variant="secondary" onclick={dismiss}>Ho capito</Button>
				<Button class="text-background" variant="link" href="/cookies">Cookie policy</Button
				>
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
	}

	p {
		margin: 0;
		line-height: 1.5;
		font-size: 14px;
	}
</style>
