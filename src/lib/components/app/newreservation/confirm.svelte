<script lang="ts">
  import Duration from "$lib/components/app/duration.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { formatDate, formatTime } from "$lib/utils";
  import type { Kind, Staff } from "@domain";

  let {
    isOpen = $bindable(),
    loading,
    staff,
    kinds,
    date,
    hour,
    duration,
  }: {
    isOpen: boolean;
    loading: boolean;
    staff?: Staff;
    kinds: Kind[];
    date: string;
    hour: string;
    duration: number;
  } = $props();
</script>

<Dialog.Root bind:open={isOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title class="text-left">Riepilogo prenotazione</Dialog.Title>
      <Dialog.Description class="text-left">
        Controlla i dettagli prima di confermare.
      </Dialog.Description>
    </Dialog.Header>

    <div class="space-y-4">
      <dl class="divide-y divide-border overflow-hidden rounded-xl border border-border bg-gray-2">
        <div class="flex items-center justify-between gap-4 px-4 py-3">
          <dt class="text-muted-foreground typo-body-sm">Staff</dt>
          <dd class="min-w-0 truncate text-right typo-label">{staff?.name}</dd>
        </div>
        <div class="flex items-center justify-between gap-4 px-4 py-3">
          <dt class="text-muted-foreground typo-body-sm">Data</dt>
          <dd class="text-right typo-label">{formatDate(date)}</dd>
        </div>
        <div class="flex items-center justify-between gap-4 px-4 py-3">
          <dt class="text-muted-foreground typo-body-sm">Orario</dt>
          <dd class="text-right typo-label tabular-nums">{formatTime(hour)}</dd>
        </div>
        <div class="flex items-center justify-between gap-4 px-4 py-3">
          <dt class="text-muted-foreground typo-body-sm">Durata</dt>
          <dd class="text-right typo-label"><Duration amount={duration} /></dd>
        </div>
      </dl>

      <section class="space-y-2" aria-labelledby="confirmation-services-title">
        <div class="flex items-center justify-between px-1">
          <h3 id="confirmation-services-title" class="text-muted-foreground typo-body-sm">
            Servizi
          </h3>
          <span class="rounded-full bg-gray-5 px-2 py-0.5 typo-caption">{kinds.length}</span>
        </div>
        <ol
          class="divide-y divide-border overflow-hidden rounded-xl border border-border bg-gray-2"
        >
          {#each kinds as kind (kind.id)}
            <li class="flex items-center justify-between gap-4 px-4 py-3">
              <span class="min-w-0 wrap-break-word typo-label">{kind.name}</span>
              <Duration amount={kind.duration} class="text-muted-foreground shrink-0" />
            </li>
          {/each}
        </ol>
      </section>
    </div>

    <Dialog.Footer>
      <Dialog.Close>
        {#snippet child({ props })}
          <Button {...props} type="button" variant="ghost">Annulla</Button>
        {/snippet}
      </Dialog.Close>
      <Button disabled={loading} type="submit" form="reservationForm">Conferma</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
