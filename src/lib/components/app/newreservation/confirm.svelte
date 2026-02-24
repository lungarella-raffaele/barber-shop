<script lang="ts">
  import { LoaderCircle } from "$lib/components/icons/index";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import type { Data, Kind, Staff } from "@domain";

  let {
    isOpen = $bindable(),
    loading,
    data: _data,
    kinds: _kinds,
    staff: _staff,
  }: {
    isOpen: boolean;
    loading: boolean;
    data?: Data;
    kinds?: Kind[];
    staff?: Staff[];
  } = $props();
</script>

<Dialog.Root bind:open={isOpen}>
  <Dialog.Content class="sm:max-w-[425px]">
    {#if loading}
      <div class="bg-background/60 absolute inset-0 rounded-lg"></div>
      <LoaderCircle size={40} strokeWidth={3} class="absolute inset-0 m-auto animate-spin" />
    {/if}

    <Dialog.Header>
      <Dialog.Title class="text-left">Sei sicuro?</Dialog.Title>
      <Dialog.Description class="text-left">
        Confermando procederemo con la prenotazione.
      </Dialog.Description>
    </Dialog.Header>

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
