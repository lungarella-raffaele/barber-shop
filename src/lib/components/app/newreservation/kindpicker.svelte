<script lang="ts">
  import Duration from "$lib/components/app/duration.svelte";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import { Checkbox } from "$lib/components/ui/checkbox";
  import * as Popover from "$lib/components/ui/popover";
  import type { Kind } from "@domain";
  import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";

  let {
    kinds,
    value = $bindable(),
    onKindChange,
  }: {
    kinds: Kind[];
    value: string[];
    onKindChange?: (value: string[]) => void;
  } = $props();

  const selectedKinds = $derived(kinds.filter((kind) => value.includes(kind.id)));

  function toggleKind(kindId: string, checked: boolean) {
    const nextValue = checked
      ? value.includes(kindId)
        ? value
        : [...value, kindId]
      : value.filter((id) => id !== kindId);

    value = nextValue;
    onKindChange?.(nextValue);
  }
</script>

<Popover.Root>
  <Popover.Trigger>
    {#snippet child({ props })}
      <Button
        {...props}
        variant="outline"
        class="h-auto min-h-12 w-full justify-between gap-3 px-3 py-2 text-left whitespace-normal enabled:active:scale-100 enabled:active:bg-gray-3 aria-expanded:bg-gray-3"
        aria-label="Seleziona i servizi"
      >
        <span class="flex min-w-0 flex-1 flex-wrap gap-1.5">
          {#if selectedKinds.length === 0}
            <span class="text-muted-foreground py-0.5 font-normal">Seleziona uno o più servizi</span
            >
          {:else}
            {#each selectedKinds as kind (kind.id)}
              <Badge variant="secondary" class="max-w-full border-gray-6 border bg-gray-5">
                <span class="truncate">{kind.name}</span>
              </Badge>
            {/each}
          {/if}
        </span>
        <ChevronDownIcon class="text-muted-foreground size-4 shrink-0" />
      </Button>
    {/snippet}
  </Popover.Trigger>

  <Popover.Content
    align="start"
    class="w-(--bits-popover-anchor-width) max-w-[calc(100vw-2rem)] gap-1 p-1.5"
  >
    <div class="max-h-72 overflow-y-auto overscroll-contain pr-1">
      {#each kinds as kind (kind.id)}
        {@const selected = value.includes(kind.id)}
        {@const checkboxId = `kind-${kind.id}`}
        <label
          for={checkboxId}
          class="hover:bg-muted flex min-h-12 cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors"
        >
          <Checkbox
            id={checkboxId}
            checked={selected}
            onCheckedChange={(checked) => toggleKind(kind.id, checked)}
          />
          <span class="flex min-w-0 flex-1 flex-col">
            <span class="truncate typo-label">{kind.name}</span>
            <Duration amount={kind.duration} class="text-muted-foreground" />
          </span>
        </label>
      {/each}
    </div>
  </Popover.Content>
</Popover.Root>
