<script lang="ts">
  import { enhance } from "$app/forms";
  import { invalidateAll } from "$app/navigation";
  import ReservationStatusBadge from "$lib/components/app/reservationstatusbadge.svelte";
  import {
    ArrowUpRight,
    ChevronLeft,
    ChevronRight,
    Clock,
    Mail,
    Trash,
    User,
  } from "$lib/components/icons";
  import { Button } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog";
  import * as Sheet from "$lib/components/ui/sheet";
  import { formatCurrency, formatDuration, formatTime } from "$lib/utils";
  import type { Reservation } from "@domain";
  import ChevronsRight from "@lucide/svelte/icons/chevrons-right";
  import type { SubmitFunction } from "@sveltejs/kit";
  import { toast } from "svelte-sonner";

  let {
    reservation = $bindable(null),
    reservations = [],
    open = $bindable(false),
  }: {
    reservation?: Reservation | null;
    reservations?: Reservation[];
    open?: boolean;
  } = $props();

  const orderedReservations = $derived(
    [...reservations].sort((a, b) => {
      const byDate = a.date.localeCompare(b.date);
      return byDate !== 0 ? byDate : a.hour.localeCompare(b.hour);
    }),
  );
  const currentIndex = $derived(
    reservation ? orderedReservations.findIndex((item) => item.id === reservation?.id) : -1,
  );
  const hasPrevious = $derived(currentIndex > 0);
  const hasNext = $derived(currentIndex >= 0 && currentIndex < orderedReservations.length - 1);
  const totalDuration = $derived(
    reservation?.kinds.reduce((total, kind) => total + kind.duration, 0) ?? 0,
  );
  const totalPrice = $derived(
    reservation?.kinds.reduce((total, kind) => total + kind.price, 0) ?? 0,
  );

  function navigate(offset: -1 | 1) {
    const nextReservation = orderedReservations[currentIndex + offset];
    if (nextReservation) reservation = nextReservation;
  }

  let deleteDialogOpen = $state(false);
  let deleting = $state(false);

  function endTime(hour: string, duration: number) {
    const [hours, minutes] = hour.split(":").map(Number);
    const end = hours * 60 + minutes + duration;
    return `${String(Math.floor(end / 60) % 24).padStart(2, "0")}:${String(end % 60).padStart(2, "0")}`;
  }

  const submitDelete: SubmitFunction = () => {
    deleting = true;
    return async ({ result }) => {
      if (result.type === "success") {
        await invalidateAll();
        toast.success("Prenotazione eliminata");
        deleteDialogOpen = false;
        open = false;
      } else {
        toast.error("Impossibile eliminare la prenotazione. Riprova più tardi.");
      }
      deleting = false;
    };
  };
</script>

<Sheet.Root bind:open>
  <Sheet.Content class="w-full sm:max-w-md" showCloseButton={false}>
    {#if reservation}
      <Sheet.Header class="border-b border-border">
        <div class="mb-3 flex items-center justify-between gap-4">
          <Sheet.Close>
            {#snippet child({ props })}
              <Button
                {...props}
                variant="ghost"
                size="icon-sm"
                aria-label="Chiudi dettagli prenotazione"
                title="Chiudi"
              >
                <ChevronsRight />
              </Button>
            {/snippet}
          </Sheet.Close>

          <div class="flex items-center gap-1" aria-label="Naviga tra le prenotazioni">
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={!hasPrevious}
              onclick={() => navigate(-1)}
              aria-label="Prenotazione precedente"
              title="Prenotazione precedente"
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={!hasNext}
              onclick={() => navigate(1)}
              aria-label="Prenotazione successiva"
              title="Prenotazione successiva"
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
        <Sheet.Title class="truncate">{reservation.name}</Sheet.Title>
        <Sheet.Description>Prenotazione delle {formatTime(reservation.hour)}</Sheet.Description>
      </Sheet.Header>

      <Sheet.Body class="space-y-6 overflow-y-auto p-5">
        <div
          class="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-4"
        >
          <div>
            <p class="typo-heading tabular-nums">
              {formatTime(reservation.hour)}–{endTime(reservation.hour, totalDuration)}
            </p>
            <p class="mt-1 typo-body-sm text-muted-foreground">
              {formatDuration(totalDuration)}
            </p>
          </div>
          <ReservationStatusBadge pending={reservation.pending} />
        </div>

        <section>
          <p class="mb-3 typo-overline text-muted-foreground">Servizio</p>
          <div class="overflow-hidden rounded-xl border border-border typo-body-sm">
            <div class="divide-y divide-border">
              {#each reservation.kinds as kind (kind.id)}
                <div class="flex items-start justify-between gap-4 p-3">
                  <div class="min-w-0">
                    <p class="typo-label">{kind.name}</p>
                    <p class="mt-0.5 typo-caption text-muted-foreground">
                      {formatDuration(kind.duration)}
                    </p>
                  </div>
                  <p class="shrink-0 typo-label">{formatCurrency(String(kind.price))}</p>
                </div>
              {/each}
            </div>
            <div
              class="flex items-center justify-between gap-4 border-t border-border bg-gray-2 p-3"
            >
              <span class="text-muted-foreground">Totale</span>
              <span class="typo-label">{formatCurrency(String(totalPrice))}</span>
            </div>
          </div>
          <div class="mt-3 flex items-center justify-between gap-4 typo-body-sm">
            <span class="text-muted-foreground">Staff</span>
            <span class="typo-label">{reservation.staff.name}</span>
          </div>
        </section>

        <section>
          <p class="mb-3 typo-overline text-muted-foreground">Cliente</p>
          <div class="space-y-3 rounded-xl border border-border p-4 typo-body-sm">
            <div class="flex items-center gap-3">
              <User class="size-4 text-muted-foreground" />
              <span class="typo-label">{reservation.name}</span>
            </div>
            <a
              class="flex items-center gap-3 text-muted-foreground hover:text-foreground"
              href="mailto:{reservation.email}"
            >
              <Mail class="size-4" />
              <span class="truncate">{reservation.email}</span>
            </a>
            <div class="flex items-center gap-3 text-muted-foreground">
              <Clock class="size-4" />
              <span>Prenotazione da {formatDuration(totalDuration)}</span>
            </div>
          </div>
        </section>
      </Sheet.Body>

      <Sheet.Footer class="grid grid-cols-[auto_1fr] gap-2 border-t border-border">
        <Button
          variant="outline"
          size="icon"
          onclick={() => (deleteDialogOpen = true)}
          aria-label="Elimina prenotazione"
        >
          <Trash />
        </Button>
        <Button href="/{reservation.id}">
          Apri scheda completa
          <ArrowUpRight />
        </Button>
      </Sheet.Footer>
    {/if}
  </Sheet.Content>
</Sheet.Root>

<Dialog.Root bind:open={deleteDialogOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title class="text-left">Eliminare questa prenotazione?</Dialog.Title>
      <Dialog.Description class="text-left">L’azione è irreversibile.</Dialog.Description>
    </Dialog.Header>
    {#if reservation}
      <form action="?/delete" method="post" use:enhance={submitDelete}>
        <input type="hidden" name="id" value={reservation.id} />
        <Dialog.Footer>
          <Button
            type="button"
            variant="outline"
            disabled={deleting}
            onclick={() => (deleteDialogOpen = false)}>Annulla</Button
          >
          <Button type="submit" variant="destructive" disabled={deleting}>
            {deleting ? "Eliminazione…" : "Elimina"}
          </Button>
        </Dialog.Footer>
      </form>
    {/if}
  </Dialog.Content>
</Dialog.Root>
