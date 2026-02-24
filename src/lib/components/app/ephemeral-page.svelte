<script lang="ts">
  import PageHeader from "$lib/components/app/pageheader.svelte";
  import type { Snippet } from "svelte";

  const {
    title,
    description,
    children,
    actions,
  }: {
    title: string;
    description: string | Snippet;
    children?: Snippet;
    actions?: Snippet;
  } = $props();
</script>

<section class="mx-auto flex w-full max-w-2xl flex-col">
  <PageHeader {title} {description} />

  {#if children || actions}
    <div class="w-full space-y-6 pb-8 sm:pb-10">
      {#if children}
        {@render children()}
      {/if}
      {#if actions}
        <div class="flex flex-wrap gap-3 pt-2">
          {@render actions()}
        </div>
      {/if}
    </div>
  {/if}
</section>
