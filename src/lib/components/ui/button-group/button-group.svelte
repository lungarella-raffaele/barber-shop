<script lang="ts">
  import { cn, type WithElementRef } from "$lib/utils.js";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
  bind:this={ref}
  role="group"
  data-slot="button-group"
  class={cn(
    "flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10 [&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-xl! *:data-slot:rounded-r-none [&>[data-slot]~[data-slot]]:rounded-l-none [&>[data-slot]~[data-slot]]:border-l-0 [&>input]:flex-1",
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</div>
