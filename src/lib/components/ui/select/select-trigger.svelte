<script lang="ts">
  import { cn, type WithoutChild } from "$lib/utils.js";
  import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
  import { Select as SelectPrimitive } from "bits-ui";

  let {
    ref = $bindable(null),
    class: className,
    children,
    size = "default",
    ...restProps
  }: WithoutChild<SelectPrimitive.TriggerProps> & {
    size?: "sm" | "default";
  } = $props();

  const sizeClasses = {
    default: "h-9",
    sm: "h-8",
  };
</script>

<SelectPrimitive.Trigger
  bind:ref
  data-slot="select-trigger"
  data-size={size}
  class={cn(
    "border-input data-placeholder:text-muted-foreground bg-input/30 hover:bg-input/50 active:bg-input/50 data-open:bg-input/50 aria-expanded:bg-input/50 data-[state=open]:bg-input/50 disabled:hover:bg-input/30 disabled:active:bg-input/30 disabled:data-open:bg-input/30 disabled:aria-expanded:bg-input/30 disabled:data-[state=open]:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 flex w-fit items-center justify-between gap-1.5 rounded-xl border px-3 py-2 typo-label whitespace-nowrap transition-colors outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-[3px] *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    sizeClasses[size],
    className,
  )}
  {...restProps}
>
  {@render children?.()}
  <ChevronDownIcon class="text-muted-foreground pointer-events-none size-4" />
</SelectPrimitive.Trigger>
