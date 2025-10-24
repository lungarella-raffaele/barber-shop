<script>
	import { BadgeCheck, BadgeX, Calendar, CircleUser, House } from '$lib/components/icons';
	import { Button } from '$lib/components/ui/button';
	import Callout from '$lib/components/ui/callout.svelte';
	const { success, error } = $props();
</script>

<div
	class="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12 lg:max-w-4xl lg:px-8 lg:py-16 xl:max-w-6xl"
>
	<article
		class="prose prose-sm mx-auto text-center dark:prose-invert sm:prose-base lg:prose-lg xl:prose-xl 2xl:prose-2xl"
	>
		<div class="flex flex-col items-center text-center">
			{#if success || error === 'not_pending'}
				<Callout title="Account confermato con successo" variant="success" class="text-sm">
					<BadgeCheck size={60} />
					<h2>Account confermato con successo</h2>
					<p>
						Grazie per aver verificato la tua mail. Le prenotazioni future avranno
						automaticamente il nome e l'email che hai specificato alla login. Le tue
						prenotazioni saranno disponibili nella sezione 'prenotazioni'.

						<br />
						<strong>N.B. Le prenotazioni passate non verranno persistite</strong>
					</p>
				</Callout>

				<div class="mt-8 flex justify-center gap-3">
					<Button href="/"><House />Home</Button>
					<Button href="/newreservation"><Calendar />Prenota</Button>
					<Button href="/profile"><CircleUser />Profilo</Button>
				</div>
			{:else}
				<Callout
					title="Account confermato con successo"
					variant="destructive"
					class="text-sm"
				>
					<BadgeX size={60} />
					<h2>C'è stato un problema nella verifica della mail</h2>
					<p>
						Ci scusiamo per il disagio, impossibile verificare la tua mail. Se il
						problema persiste non esitare a contattarci.
					</p>
				</Callout>
			{/if}
		</div>
	</article>
</div>
