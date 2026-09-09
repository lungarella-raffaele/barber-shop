<script lang="ts" module>
  export type Side = "top" | "right" | "bottom" | "left";
</script>

<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";
  import XIcon from "@lucide/svelte/icons/x";
  import { Dialog as SheetPrimitive } from "bits-ui";
  import type { Snippet } from "svelte";
  import type { ComponentProps } from "svelte";

  import SheetOverlay from "./sheet-overlay.svelte";
  import SheetPortal from "./sheet-portal.svelte";

  let {
    ref = $bindable(null),
    class: className,
    side = "right",
    showCloseButton = true,
    portalProps,
    children,
    ...restProps
  }: WithoutChildrenOrChild<SheetPrimitive.ContentProps> & {
    portalProps?: WithoutChildrenOrChild<ComponentProps<typeof SheetPortal>>;
    side?: Side;
    showCloseButton?: boolean;
    children: Snippet;
  } = $props();
</script>

<SheetPortal {...portalProps}>
  <SheetOverlay />
  <SheetPrimitive.Content
    bind:ref
    data-slot="sheet-content"
    data-side={side}
    class={cn(
      "border-border bg-background fixed z-50 flex flex-col bg-clip-padding typo-body-sm shadow-lg duration-200 ease-out data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-open:animate-in data-open:fade-in-0 data-[side=bottom]:data-[state=open]:slide-in-from-bottom data-[side=bottom]:data-open:slide-in-from-bottom data-[side=left]:data-[state=open]:slide-in-from-left data-[side=left]:data-open:slide-in-from-left data-[side=right]:data-[state=open]:slide-in-from-right data-[side=right]:data-open:slide-in-from-right data-[side=top]:data-[state=open]:slide-in-from-top data-[side=top]:data-open:slide-in-from-top data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-closed:animate-out data-closed:fade-out-0 data-[side=bottom]:data-[state=closed]:slide-out-to-bottom data-[side=bottom]:data-closed:slide-out-to-bottom data-[side=left]:data-[state=closed]:slide-out-to-left data-[side=left]:data-closed:slide-out-to-left data-[side=right]:data-[state=closed]:slide-out-to-right data-[side=right]:data-closed:slide-out-to-right data-[side=top]:data-[state=closed]:slide-out-to-top data-[side=top]:data-closed:slide-out-to-top",
      className,
    )}
    {...restProps}
  >
    {@render children?.()}
    {#if showCloseButton}
      <SheetPrimitive.Close data-slot="sheet-close">
        {#snippet child({ props })}
          <Button variant="ghost" class="absolute top-4 right-4" size="icon-sm" {...props}>
            <XIcon />
            <span class="sr-only">Close</span>
          </Button>
        {/snippet}
      </SheetPrimitive.Close>
    {/if}
  </SheetPrimitive.Content>
</SheetPortal>
