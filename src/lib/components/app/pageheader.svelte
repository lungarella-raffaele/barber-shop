<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    title: string;
    description?: string | Snippet;
  };
  const { title, description }: Props = $props();
</script>

<header class="mb-8 max-w-3xl px-2">
  <h1 class="typo-title text-balance">
    {title}
  </h1>
  {#if typeof description === "string"}
    <p class="text-muted-foreground mt-2 max-w-2xl typo-body text-pretty">
      {description}
    </p>
  {:else if description}
    <div class="text-muted-foreground mt-2 max-w-2xl typo-body text-pretty">
      {@render description()}
    </div>
  {/if}
</header>
