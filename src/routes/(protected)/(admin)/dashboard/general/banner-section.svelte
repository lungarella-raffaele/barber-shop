<script lang="ts">
  import { enhance } from "$app/forms";
  import { LoaderCircle } from "$lib/components/icons/index";
  import { Button } from "$lib/components/ui/button";
  import { Label } from "$lib/components/ui/label";
  import { Switch } from "$lib/components/ui/switch";
  import { Textarea } from "$lib/components/ui/textarea";
  import * as Tooltip from "$lib/components/ui/tooltip";
  import type { SubmitFunction } from "@sveltejs/kit";
  import { toast } from "svelte-sonner";

  import { getDataContext } from "./context";

  const context = getDataContext();
  const banner = $derived(context.data.banner);
  let message = $derived(banner?.message ?? "");
  let bannerVisible = $derived(banner?.visible ?? false);
  let loading = $state(false);

  let form = $state<HTMLFormElement>();

  const submitBanner: SubmitFunction = () => {
    loading = true;
    return async ({ result, update }) => {
      await update();
      loading = false;
      if (result.type === "failure") {
        toast.error("Impossibile aggiornare il banner.");
      }
    };
  };
</script>

<div class="absolute right-4 top-4">
  <Tooltip.Provider delayDuration={0}>
    <Tooltip.Root>
      <Tooltip.Trigger>
        {#if bannerVisible}
          <span class="relative flex size-2.5">
            <span
              class="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/50 opacity-75"
            ></span>
            <span class="relative inline-flex size-2.5 rounded-full bg-success"></span>
          </span>
        {:else}
          <span class="relative flex size-2.5">
            <span class="relative inline-flex size-2.5 rounded-full bg-muted-foreground/30"></span>
          </span>
        {/if}
      </Tooltip.Trigger>
      <Tooltip.Content>
        {#if bannerVisible}
          Visibile
        {:else}
          Nascosto
        {/if}
      </Tooltip.Content>
    </Tooltip.Root>
  </Tooltip.Provider>
</div>

<form
  method="post"
  use:enhance={submitBanner}
  action="?/updateBanner"
  id="banner-form"
  class="space-y-4"
  bind:this={form}
>
  <Label for="message">Messaggio</Label>
  <input type="hidden" name="visible" value={bannerVisible} />
  <Textarea bind:value={message} id="message" name="message" placeholder="Banner da inserire" />
</form>

<div class="border-border mt-6 flex items-center justify-between border-t pt-6">
  <div class="flex items-center gap-2">
    <Switch id="banner-visible" bind:checked={bannerVisible} disabled={loading} />
    <Label class="mb-0" for="banner-visible">
      {#if bannerVisible}
        Nascondi
      {:else}
        Mostra
      {/if}
    </Label>
  </div>

  <Button type="submit" form="banner-form" disabled={loading}>
    {#if loading}
      <LoaderCircle class="animate-spin" />
      Attendi
    {:else}
      Salva
    {/if}
  </Button>
</div>
