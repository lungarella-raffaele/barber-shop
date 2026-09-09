<script lang="ts">
  import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";
  import { RadioGroup as RadioGroupPrimitive } from "bits-ui";

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: WithoutChildrenOrChild<RadioGroupPrimitive.ItemProps> = $props();
</script>

<RadioGroupPrimitive.Item
  bind:ref
  data-slot="radio-group-item"
  class={cn(
    "border-input dark:bg-input/30 data-[state=checked]:border-accent aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:aria-invalid:border-destructive/50 flex size-4 rounded-full transition-[background-color,border-color,box-shadow,transform] duration-150 ease-out focus-visible:ring-3 aria-invalid:ring-2 hover:data-[state=unchecked]:border-gray-7 hover:data-[state=checked]:border-accent enabled:active:scale-95 group/radio-group-item peer relative aspect-square shrink-0 border outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50",
    className,
  )}
  {...restProps}
>
  {#snippet children({ checked })}
    <div data-slot="radio-group-indicator" class="flex size-4 items-center justify-center">
      {#if checked}
        <span
          class="bg-accent absolute top-1/2 left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-150 ease-out group-active/radio-group-item:scale-90"
        ></span>
      {/if}
    </div>
  {/snippet}
</RadioGroupPrimitive.Item>
