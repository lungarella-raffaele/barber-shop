<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";

  let { pressed = $bindable(), onclick }: { pressed: boolean; onclick?: () => void } = $props();
</script>

<Button
  type="button"
  variant="outline"
  aria-label="toggle edit"
  onclick={() => {
    pressed = !pressed;
    onclick?.();
  }}
>
  {#if pressed}
    Annulla
  {:else}
    Modifica
  {/if}
</Button>
