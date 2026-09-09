<script lang="ts">
  import { cn } from "$lib/utils.js";
  import { Menubar as MenubarPrimitive } from "bits-ui";

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: MenubarPrimitive.SubContentProps = $props();
</script>

<MenubarPrimitive.SubContent
  bind:ref
  data-slot="menubar-sub-content"
  class={cn(
    "bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/5 min-w-32 rounded-xl p-1 shadow-2xl ring-1 duration-100",
    className,
  )}
  {...restProps}
/>
