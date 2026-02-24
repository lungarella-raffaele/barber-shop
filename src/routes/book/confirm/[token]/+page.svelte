<script lang="ts">
  import EphemeralPage from "$lib/components/app/ephemeral-page.svelte";
  import ReservationSummary from "$lib/components/app/reservation-summary.svelte";
  import { Button } from "$lib/components/ui/button";
  import { BARBER_SHOP_DETAILS } from "$lib/constants";

  import type { PageData } from "./$types";

  const { data }: { data: PageData } = $props();

  const description = $derived(
    data.success
      ? "La tua prenotazione è stata registrata correttamente."
      : data.error === "expired"
        ? "La prenotazione è scaduta. Effettua una nuova prenotazione per scegliere un nuovo orario."
        : `C'è stato un problema. Riprova oppure chiama il numero ${BARBER_SHOP_DETAILS.phone}.`,
  );
</script>

<svelte:head>
  <title>Prenotazione confermata</title>
  <meta name="description" content="Conferma della prenotazione effettuata." />
</svelte:head>

<EphemeralPage
  title={data.success ? "Prenotazione confermata" : "Conferma non riuscita"}
  {description}
>
  {#if data.success && data.reservation}
    <ReservationSummary reservation={data.reservation} />
  {/if}

  {#snippet actions()}
    <Button href="/book" variant="outline" class="flex-1 sm:flex-none">Prenota ancora</Button>
    <Button href="/profile/myreservations" class="flex-1 sm:flex-none">Mie prenotazioni</Button>
  {/snippet}
</EphemeralPage>
