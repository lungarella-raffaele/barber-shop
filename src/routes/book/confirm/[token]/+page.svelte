<script lang="ts">
  import EphemeralPage from "$lib/components/app/ephemeral-page.svelte";
  import ReservationSummary from "$lib/components/app/reservation-summary.svelte";
  import { Button } from "$lib/components/ui/button";
  import { BARBER_SHOP_DETAILS } from "$lib/constants";

  import type { PageProps } from "./$types";

  const { data, form }: PageProps = $props();
  const result = $derived(form ?? data);
  const isConfirmed = $derived(result.status === "confirmed");
  const isReady = $derived(result.status === "ready");
  const description = $derived(
    isConfirmed
      ? "La tua prenotazione è stata registrata correttamente."
      : isReady
        ? "Controlla i dettagli e conferma la prenotazione."
        : result.status === "expired"
          ? "La prenotazione è scaduta. Effettua una nuova prenotazione per scegliere un nuovo orario."
          : `Il link non è valido o è già stato utilizzato. Riprova oppure chiama il numero ${BARBER_SHOP_DETAILS.phone}.`,
  );
</script>

<svelte:head>
  <title>{isConfirmed ? "Prenotazione confermata" : "Conferma prenotazione"}</title>
  <meta name="description" content="Conferma della prenotazione effettuata." />
</svelte:head>

<EphemeralPage
  title={isConfirmed
    ? "Prenotazione confermata"
    : isReady
      ? "Conferma prenotazione"
      : "Conferma non riuscita"}
  {description}
>
  {#if (isReady || isConfirmed) && result.reservation}
    <ReservationSummary reservation={result.reservation} />
  {/if}

  {#snippet actions()}
    {#if isReady}
      <form method="POST" class="flex-1 sm:flex-none">
        <Button type="submit" class="w-full">Conferma prenotazione</Button>
      </form>
    {:else}
      <Button href="/book" variant="outline" class="flex-1 sm:flex-none">Prenota ancora</Button>
      <Button href="/profile/myreservations" class="flex-1 sm:flex-none">Mie prenotazioni</Button>
    {/if}
  {/snippet}
</EphemeralPage>
