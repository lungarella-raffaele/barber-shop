<script lang="ts">
  import * as RadioGroup from "$lib/components/ui/radio-group/index.js";
  import { formatDate, formatTime } from "$lib/utils";
  import type { Slot } from "@domain";

  let {
    availableSlots,
    date,
    value = $bindable(),
  }: { availableSlots: Slot[]; date: string; value: string } = $props();

  const selectableSlots = $derived(
    availableSlots.filter((slot) => slot.available && !slot.invalid && !slot.past),
  );
</script>

<div>
  <h2 class="sr-only">Seleziona un orario</h2>

  {#if date && selectableSlots.length > 0}
    <RadioGroup.Root bind:value class="flex w-full flex-col gap-2">
      {#each selectableSlots as s (s.start.toString())}
        {@render SlotEntry(s)}
      {/each}
    </RadioGroup.Root>
  {:else if date}
    <div class="selection-group px-6! py-5!">
      <p>Nessun orario disponibile per il {formatDate(date.toString())}</p>
      <p class="text-muted-foreground typo-body-sm">Scegli un altro giorno</p>
    </div>
  {:else}
    <div
      class="text-muted-foreground flex h-20 items-center justify-center bg-transparent! px-6 py-5"
    >
      <span>Nessuna data selezionata</span>
    </div>
  {/if}
</div>

{#snippet SlotEntry(s: Slot)}
  {@const slotValue = s.start.toString()}
  {@const slotId = `slot-${slotValue}`}

  <label
    for={slotId}
    class="selection-item min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-2 text-left"
    data-state={value === slotValue ? "on" : "off"}
  >
    <RadioGroup.Item
      id={slotId}
      value={slotValue}
      aria-label={`Scegli le ${formatTime(s.start)}`}
    />
    <span class="typo-label tabular-nums">{formatTime(s.start)}</span>
  </label>
{/snippet}
