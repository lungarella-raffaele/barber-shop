<script lang="ts">
  import { cn } from "$lib/utils.js";
  import { Menubar as MenubarPrimitive } from "bits-ui";

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: MenubarPrimitive.TriggerProps = $props();
</script>

<MenubarPrimitive.Trigger
  bind:ref
  data-slot="menubar-trigger"
  class={cn(
    "hover:bg-muted aria-expanded:bg-muted flex items-center rounded-xl px-2  py-0.75 typo-label outline-hidden select-none",
    className,
  )}
  {...restProps}
/>
