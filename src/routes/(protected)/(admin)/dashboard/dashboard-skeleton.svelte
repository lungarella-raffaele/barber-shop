<script lang="ts">
  import { Skeleton } from "$lib/components/ui/skeleton";
</script>

<div
  class="overflow-hidden rounded-xl border border-border bg-card shadow-xs"
  aria-label="Caricamento prenotazioni"
  aria-busy="true"
>
  <div class="border-b border-border bg-muted/35 px-4 py-3 sm:px-5">
    <Skeleton class="h-4 w-32" />
    <Skeleton class="mt-2 h-3 w-64 max-w-full" />
  </div>

  <div class="divide-y divide-border">
    {#each Array(5) as _}
      <div
        class="grid grid-cols-[4.5rem_1fr_auto] items-center gap-3 px-4 py-4 sm:grid-cols-[6rem_1fr_auto] sm:gap-5 sm:px-5"
      >
        <div class="space-y-2">
          <Skeleton class="h-6 w-14" />
          <Skeleton class="h-3 w-16" />
        </div>
        <div class="space-y-2 border-l-2 border-border pl-3 sm:pl-5">
          <Skeleton class="h-4 w-40 max-w-full" />
          <Skeleton class="h-3 w-56 max-w-full" />
        </div>
        <Skeleton class="hidden h-4 w-16 sm:block" />
      </div>
    {/each}
  </div>
</div>
