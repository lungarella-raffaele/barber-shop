<script lang="ts">
  import * as Select from "$lib/components/ui/select/index.js";
  import { formatTime } from "$lib/utils";
  import type { Slot } from "@domain";

  let {
    availableSlots,
    date,
    value = $bindable(),
    onHourChange,
  }: {
    availableSlots: Slot[];
    date: string;
    value: string;
    onHourChange?: (value: string) => void;
  } = $props();

  const selectableSlots = $derived(
    availableSlots.filter((slot) => slot.available && !slot.invalid && !slot.past),
  );
  const selectedSlot = $derived(selectableSlots.find((slot) => slot.start.toString() === value));
  const placeholder = $derived(
    date && selectableSlots.length === 0 ? "Nessun orario disponibile" : "Seleziona un orario",
  );
</script>

<div>
  <h2 class="sr-only">Seleziona un orario</h2>

  <Select.Root
    type="single"
    bind:value
    disabled={selectableSlots.length === 0}
    onValueChange={onHourChange}
  >
    <Select.Trigger class="h-12 w-full" aria-label="Seleziona un orario">
      <span data-slot="select-value" class:tabular-nums={selectedSlot}>
        {selectedSlot ? formatTime(selectedSlot.start) : placeholder}
      </span>
    </Select.Trigger>
    <Select.Content class="max-h-64">
      {#each selectableSlots as slot (slot.start.toString())}
        {@const slotValue = slot.start.toString()}
        <Select.Item value={slotValue} label={formatTime(slot.start)}>
          <span class="tabular-nums">{formatTime(slot.start)}</span>
        </Select.Item>
      {/each}
    </Select.Content>
  </Select.Root>
</div>
