<script lang="ts">
  import EphemeralPage from "$lib/components/app/ephemeral-page.svelte";

  import type { PageData } from "./$types";

  const { data }: { data: PageData } = $props();
  const success = $derived(data.status === "already-verified");
  const description = $derived(
    success
      ? "Grazie per aver verificato la tua email. Ora puoi gestire il profilo e le tue prenotazioni."
      : data.status === "invalid"
        ? "Il link non è valido o l'account non esiste più."
        : "Si è verificato un problema durante la verifica. Riprova più tardi.",
  );
</script>

<svelte:head>
  <title>Verifica email</title>
  <meta name="description" content="Verifica dell'indirizzo email del tuo account." />
</svelte:head>

<EphemeralPage title={success ? "Email verificata" : "Verifica email non riuscita"} {description}
></EphemeralPage>
