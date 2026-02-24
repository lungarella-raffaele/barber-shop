<script lang="ts">
  import EphemeralPage from "$lib/components/app/ephemeral-page.svelte";
  import { Button } from "$lib/components/ui/button";

  import type { PageData } from "./$types";

  const { data }: { data: PageData } = $props();

  const success = $derived(data.status === "confirmed");
</script>

<svelte:head>
  <title>Conferma cambio email</title>
  <meta name="description" content="Conferma del nuovo indirizzo email del tuo account." />
</svelte:head>

{#snippet description()}
  {#if data.status === "confirmed"}
    <p>Il tuo nuovo indirizzo email è <strong class="text-foreground">{data.email}</strong>.</p>
  {:else if data.status === "unauthorized"}
    <p>Accedi con l'account che ha richiesto il cambio email e riapri questo link.</p>
  {:else if data.status === "forbidden"}
    <p>Questo link appartiene a un altro account.</p>
  {:else if data.status === "expired"}
    <p>La richiesta è scaduta. Richiedi nuovamente il cambio dal tuo profilo.</p>
  {:else if data.status === "invalid"}
    <p>Il link non è valido o è già stato utilizzato.</p>
  {:else}
    <p>Si è verificato un problema. Riprova più tardi.</p>
  {/if}
{/snippet}

<EphemeralPage title={success ? "Email aggiornata" : "Cambio email non riuscito"} {description}>
  {#snippet actions()}
    <Button href={data.status === "unauthorized" ? "/login" : "/profile"}>
      {data.status === "unauthorized" ? "Accedi" : "Torna al profilo"}
    </Button>
  {/snippet}
</EphemeralPage>
