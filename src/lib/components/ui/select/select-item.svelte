<script lang="ts">
  import { cn, type WithoutChild } from "$lib/utils.js";
  import CheckIcon from "@lucide/svelte/icons/check";
  import { Select as SelectPrimitive } from "bits-ui";

  let {
    ref = $bindable(null),
    class: className,
    value,
    label,
    children: childrenProp,
    ...restProps
  }: WithoutChild<SelectPrimitive.ItemProps> = $props();
</script>

<SelectPrimitive.Item
  bind:ref
  {value}
  data-slot="select-item"
  class={cn(
    "focus:bg-gray-3 focus:text-foreground not-data-[variant=destructive]:focus:**:text-foreground data-highlighted:bg-gray-3 data-highlighted:text-foreground relative flex w-full cursor-default items-center gap-2.5 rounded-lg py-2.5 pr-9 pl-3.5 typo-label outline-hidden select-none data-disabled:cursor-not-allowed data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
    className,
  )}
  {...restProps}
>
  {#snippet children({ selected, highlighted })}
    <span class="absolute end-2 flex size-3.5 items-center justify-center">
      {#if selected}
        <CheckIcon class="cn-select-item-indicator-icon" />
      {/if}
    </span>
    {#if childrenProp}
      {@render childrenProp({ selected, highlighted })}
    {:else}
      {label || value}
    {/if}
  {/snippet}
</SelectPrimitive.Item>
