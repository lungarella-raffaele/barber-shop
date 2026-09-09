<script lang="ts">
  import { cn } from "$lib/utils.js";
  import { Menubar as MenubarPrimitive } from "bits-ui";

  let {
    ref = $bindable(null),
    value = $bindable(""),
    class: className,
    ...restProps
  }: MenubarPrimitive.RootProps = $props();
</script>

<MenubarPrimitive.Root
  bind:ref
  bind:value
  data-slot="menubar"
  class={cn("flex h-9 items-center rounded-xl border p-1", className)}
  {...restProps}
/>
