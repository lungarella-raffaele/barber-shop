<script lang="ts">
  import Duration from "$lib/components/app/duration.svelte";
  import { Checkbox } from "$lib/components/ui/checkbox";
  import * as ToggleGroup from "$lib/components/ui/toggle-group";
  import type { Kind } from "@domain";

  let {
    kinds,
    value = $bindable(),
    onKindChange,
  }: {
    kinds: Kind[];
    value: string[];
    onKindChange?: (value: string[]) => void;
  } = $props();
</script>

{#if kinds.length === 0}
  <span class="text-muted-foreground">Nessun servizio disponibile</span>
{:else}
  <ToggleGroup.Root
    type="multiple"
    bind:value
    onValueChange={onKindChange}
    orientation="vertical"
    class="selection-group grid w-full grid-cols-1"
    spacing={3}
  >
    {#each kinds as kind (kind.id)}
      {@const selected = value.includes(kind.id)}
      <ToggleGroup.Item
        value={kind.id}
        aria-label={`Scegli ${kind.name}`}
        class="selection-item min-h-16 w-full items-center justify-start gap-2 rounded-xl px-4 py-3 text-left"
      >
        <Checkbox checked={selected} tabindex={-1} aria-hidden="true" class="pointer-events-none" />
        <div class="min-w-0 flex-1 text-left">
          <div class="truncate typo-label">{kind.name}</div>
          <Duration amount={kind.duration} class="text-muted-foreground" />
        </div>
      </ToggleGroup.Item>
    {/each}
  </ToggleGroup.Root>
{/if}
