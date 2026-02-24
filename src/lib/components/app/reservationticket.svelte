<script lang="ts">
  import ReservationStatusBadge from "$lib/components/app/reservationstatusbadge.svelte";
  import { formatCurrency, formatDate, formatDuration } from "$lib/utils";
  import type { Reservation } from "@domain";

  const { reservation }: { reservation: Reservation } = $props();

  const shortId = $derived(reservation.id.slice(0, 8).toUpperCase());
  const totalDuration = $derived(
    reservation.kinds.reduce((total, kind) => total + kind.duration, 0),
  );
  const totalPrice = $derived(reservation.kinds.reduce((total, kind) => total + kind.price, 0));

  function displayTime(hour: string) {
    const parts = hour.split(":");
    return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : hour;
  }
</script>

<div
  class="ticket relative overflow-hidden rounded-2xl bg-gray-4 dark:bg-gray-3 border border-border"
>
  <div class="grid md:grid-cols-[1fr_8.5rem]">
    <section class="p-8">
      <div class="min-w-0">
        <p class="typo-overline text-muted-foreground">EMI HAIR CLUB</p>
        <div class="mt-4 min-w-0 space-y-1">
          {#each reservation.kinds as kind (kind.id)}
            <h3 class="typo-subtitle text-foreground">{kind.name}</h3>
          {/each}
        </div>
        <p class="mt-1 typo-body-sm text-muted-foreground">
          con {reservation.staff?.name}
        </p>
      </div>

      <dl class="mt-6 grid gap-2 typo-body-sm">
        <div class="grid gap-1 sm:grid-cols-[4.5rem_1fr]">
          <dt class="typo-label text-muted-foreground">Cliente:</dt>
          <dd class="min-w-0">
            <span class="typo-label text-foreground">
              {reservation.name}
            </span>
            <span class="text-muted-foreground"> - </span>
            <span class="truncate">
              {reservation.email}
            </span>
          </dd>
        </div>

        <div class="grid gap-1 sm:grid-cols-[4.5rem_1fr]">
          <dt class="typo-label text-muted-foreground">Data:</dt>
          <dd class="typo-label text-foreground">
            {formatDate(reservation.date)}, {displayTime(reservation.hour)}
          </dd>
        </div>

        <div class="grid gap-1 sm:grid-cols-[4.5rem_1fr]">
          <dt class="typo-label text-muted-foreground">Totale:</dt>
          <dd class="typo-label text-foreground">
            {formatCurrency(String(totalPrice))}
          </dd>
        </div>

        <div class="grid gap-1 sm:grid-cols-[4.5rem_1fr]">
          <dt class="typo-label text-muted-foreground">Durata:</dt>
          <dd class="typo-label text-foreground">
            {formatDuration(totalDuration)}
          </dd>
        </div>
      </dl>
    </section>

    <aside
      class="relative flex items-center justify-between border-t border-border p-8 md:min-h-full md:flex-col md:border-l md:border-t-0"
    >
      <div class="text-left md:text-center">
        <p class="font-mono typo-caption text-foreground">
          <span class="text-muted-foreground">#</span>{shortId}
        </p>
      </div>

      <div class="text-left md:text-center">
        <p class="typo-overline text-muted-foreground">Stato</p>
        <ReservationStatusBadge class="mt-2" pending={reservation.pending} />
      </div>
    </aside>
  </div>
</div>
