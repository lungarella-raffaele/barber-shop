<script lang="ts">
  import EphemeralPage from "$lib/components/app/ephemeral-page.svelte";
  import ReservationSummary from "$lib/components/app/reservation-summary.svelte";
  import { CirclePlus, Library } from "$lib/components/icons";
  import { Button } from "$lib/components/ui/button";

  import type { PageData } from "./$types";

  const { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Dettagli prenotazione</title>
  <meta
    name="description"
    content="Visualizza i dettagli della tua prenotazione: nome, email, data e servizio selezionato."
  />
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<EphemeralPage
  title="Dettagli prenotazione"
  description="Consulta le informazioni della tua prenotazione."
>
  <ReservationSummary reservation={data.reservation} />

  {#snippet actions()}
    <Button href="/book" variant="outline" class="flex-1 sm:flex-none">
      <CirclePlus />
      Nuova prenotazione
    </Button>
    <Button href="/profile/myreservations" class="flex-1 sm:flex-none">
      <Library />
      Prenotazioni
    </Button>
  {/snippet}
</EphemeralPage>
