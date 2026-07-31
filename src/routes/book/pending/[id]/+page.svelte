<script lang="ts">
  import EphemeralPage from "$lib/components/app/ephemeral-page.svelte";
  import ReservationSummary from "$lib/components/app/reservation-summary.svelte";
  import { Progress } from "$lib/components/ui/progress";
  import { BARBER_SHOP_DETAILS, LOCK_DURATION } from "$lib/constants";
  import Timer from "$lib/timer.svelte";
  import { onMount } from "svelte";

  import type { PageData } from "./$types";

  const { data }: { data: PageData } = $props();
  const timer = new Timer();

  onMount(() => {
    if (!data.success || !data.reservation) return;
    const timeLeft = data.reservation.expiresAt.getTime() - Date.now();
    if (timeLeft > 0) timer.start(timeLeft);
  });

  const isExpired = $derived(data.error === "expired" || timer.isEnded);
  const isConfirmed = $derived(
    Boolean(data.success && data.reservation && !data.reservation.pending),
  );
  const title = $derived(
    isConfirmed
      ? "Prenotazione confermata"
      : data.success && data.reservation && !isExpired
        ? "Prenotazione in attesa"
        : isExpired
          ? "Tempo scaduto"
          : "Prenotazione non disponibile",
  );
  const description = $derived(
    isConfirmed
      ? "La tua prenotazione è stata registrata correttamente."
      : data.success && data.reservation && !isExpired
        ? `Abbiamo inviato un link di conferma a ${data.reservation.email}. Controlla la tua casella di posta.`
        : isExpired
          ? "La prenotazione non è più riservata. Effettua una nuova prenotazione per scegliere un nuovo orario."
          : `Riprova oppure chiama il numero ${BARBER_SHOP_DETAILS.phone}.`,
  );
</script>

<svelte:head>
  <title>Prenotazione in attesa</title>
  <meta name="description" content="Conferma via email richiesta per completare la prenotazione." />
</svelte:head>

<EphemeralPage {title} {description}>
  {#if data.success && data.reservation}
    {#if !isExpired && data.reservation.pending}
      <div class="space-y-2 text-center">
        <p class="text-muted-foreground typo-body-sm">Hai a disposizione</p>
        <p class="typo-heading">{timer.show()}</p>
        <Progress value={timer.timeLeft} max={LOCK_DURATION} />
      </div>
    {/if}
    <ReservationSummary reservation={data.reservation} />
  {/if}
</EphemeralPage>
