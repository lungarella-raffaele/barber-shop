<script lang="ts">
  import type { Snippet } from "svelte";

  const { title, subtitle, children }: { title: string; subtitle: string; children: Snippet } =
    $props();
</script>

<div class="flex w-full flex-col items-start md:flex-row">
  <div class="mb-12 md:flex md:w-[40%] md:flex-col md:items-end md:justify-center md:px-8">
    <h1 class="typo-title">{title}</h1>
    <p class="text-muted-foreground mt-2">{subtitle}</p>
  </div>

  <div class="bg-border hidden w-px self-stretch md:block"></div>

  <div class="w-full min-w-0 md:ms-8 md:flex-1 lg:max-w-lg">
    {@render children()}
  </div>
</div>
