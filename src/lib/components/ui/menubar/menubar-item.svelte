<script lang="ts">
  import { cn } from "$lib/utils.js";
  import { Menubar as MenubarPrimitive } from "bits-ui";

  let {
    ref = $bindable(null),
    class: className,
    inset = undefined,
    variant = "default",
    ...restProps
  }: MenubarPrimitive.ItemProps & {
    inset?: boolean;
    variant?: "default" | "destructive";
  } = $props();
</script>

<MenubarPrimitive.Item
  bind:ref
  data-slot="menubar-item"
  data-inset={inset}
  data-variant={variant}
  class={cn(
    "focus:bg-muted data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-muted data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:text-destructive not-data-[variant=destructive]:focus:**:text-foreground group/menubar-item relative flex cursor-default items-center gap-2.5 rounded-lg px-3 py-2 typo-label outline-hidden select-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-inset:pl-9.5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    className,
  )}
  {...restProps}
/>
