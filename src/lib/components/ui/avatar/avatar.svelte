<script lang="ts">
  import { cn } from "$lib/utils.js";
  import { Avatar as AvatarPrimitive } from "bits-ui";

  let {
    ref = $bindable(null),
    loadingStatus = $bindable("loading"),
    size = "default",
    class: className,
    ...restProps
  }: AvatarPrimitive.RootProps & {
    size?: "default" | "sm" | "lg";
  } = $props();
</script>

<AvatarPrimitive.Root
  bind:ref
  bind:loadingStatus
  data-slot="avatar"
  data-size={size}
  class={cn(
    "size-8 ring-1 ring-foreground rounded-full data-[size=lg]:size-10 data-[size=sm]:size-6 group/avatar relative flex shrink-0 select-none border-2 border-gray-2",
    className,
  )}
  {...restProps}
/>
