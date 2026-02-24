<script lang="ts">
  import { cn } from "$lib/utils.js";
  import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";

  let {
    ref = $bindable(null),
    class: className,
    inset,
    children,
    ...restProps
  }: DropdownMenuPrimitive.SubTriggerProps & {
    inset?: boolean;
  } = $props();
</script>

<DropdownMenuPrimitive.SubTrigger
  bind:ref
  data-slot="dropdown-menu-sub-trigger"
  data-inset={inset}
  class={cn(
    "focus:bg-muted focus:text-foreground data-open:bg-muted data-open:text-foreground not-data-[variant=destructive]:focus:**:text-foreground flex cursor-default items-center gap-2 rounded-lg px-3 py-2 typo-label outline-hidden select-none data-inset:pl-9.5 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    className,
  )}
  {...restProps}
>
  {@render children?.()}
  <ChevronRightIcon class="ml-auto" />
</DropdownMenuPrimitive.SubTrigger>
