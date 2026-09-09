<script>
  import { page } from "$app/state";
  import { Button } from "$lib/components/ui/button";
  import ArrowLeft from "@lucide/svelte/icons/arrow-left";
</script>

<div class="flex h-full flex-col justify-center text-center">
  {#if page.status === 404}
    <div class="flex items-center justify-center gap-4 leading-none">
      <span class="text-accent text-[10rem] font-bold sm:text-[22rem]">4</span>
      <img
        src="/pulp-fiction.webp"
        alt="John Travolta confused"
        class="size-36 rounded-xl object-cover sm:size-60"
      />
      <span class="text-accent text-[10rem] font-bold sm:text-[22rem]">4</span>
    </div>
  {:else}
    <h1 class="text-accent text-[14rem] font-bold">
      {page.status}
    </h1>
  {/if}

  <h1 class="mb-4 typo-heading">
    {#if page.status === 500}
      Ops, qualcosa è andato storto.
    {:else}
      La pagina non esiste.
    {/if}
  </h1>

  {#if page.status === 500}
    <p>Si è verificato un errore interno. Riprova tra qualche minuto. Scusa per il disagio!</p>
  {/if}

  <div class="mt-8">
    <Button href="/" variant="default">
      <ArrowLeft />
      Torna indietro</Button
    >
  </div>
</div>
