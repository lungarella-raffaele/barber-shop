<script lang="ts">
  import { enhance } from "$app/forms";
  import { invalidateAll } from "$app/navigation";
  import { Ellipsis } from "$lib/components/icons/index";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index";
  import type { SubmitFunction } from "@sveltejs/kit";
  import { toast } from "svelte-sonner";

  const { id }: { id: string } = $props();

  let isDialogOpen = $state(false);

  const openDialog = () => {
    isDialogOpen = true;
  };

  const closeDialog = () => {
    isDialogOpen = false;
  };

  const submitDelete: SubmitFunction = async () => {
    return async ({ result }) => {
      if (result.type === "success" && result.data) {
        await invalidateAll();
        toast.success("Prenotazione eliminata");
      } else if (result.type === "failure") {
        toast.error(`Errore durante l'eliminazione della prenotazione. Riprova più tardi`);
      }

      isDialogOpen = false;
    };
  };
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="ghost" size="icon" class="relative size-8 p-0">
        <span class="sr-only">Open menu</span>
        <Ellipsis class="size-4" />
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Item>
      {#snippet child({ props })}
        <a {...props} href="/{id}">Vedi dettaglio</a>
      {/snippet}
    </DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item onclick={openDialog} variant="destructive">Elimina</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>

<Dialog.Root bind:open={isDialogOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title class="text-left">Sei sicuro di voler disdire l'appuntamento?</Dialog.Title>
      <Dialog.Description class="text-left">L'azione è irreversibile.</Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <div class="flex flex-row-reverse">
        <form action="?/delete" method="post" use:enhance={submitDelete}>
          <input type="hidden" name="id" value={id} />
          <Button class="ml-2" aria-label="Conferma" type="submit" variant="destructive"
            >Conferma</Button
          >
        </form>

        <Button variant="outline" onclick={closeDialog}>Chiudi</Button>
      </div>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
