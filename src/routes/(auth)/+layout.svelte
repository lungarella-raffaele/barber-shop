<script lang="ts">
  import type { Snippet } from "svelte";

  const { children }: { children: Snippet } = $props();
</script>

<div class="flex flex-1 items-center justify-center">
  {@render children()}
</div>
