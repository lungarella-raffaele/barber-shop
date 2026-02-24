<script lang="ts">
  import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";
  import { Switch as SwitchPrimitive } from "bits-ui";

  const rootBaseClasses =
    "peer relative inline-flex h-6 min-h-4 w-10 shrink-0 cursor-pointer items-center rounded-full outline-none transition-[background-color,box-shadow,opacity,transform] duration-200 ease-out after:absolute after:-inset-x-3 after:-inset-y-2 enabled:active:scale-[0.98]";

  const rootStateClasses =
    "data-[state=checked]:bg-accent-10 data-[state=unchecked]:bg-gray-6 dark:data-[state=unchecked]:bg-gray-6 hover:data-[state=unchecked]:bg-gray-7 hover:data-[state=checked]:bg-accent";

  const rootFocusClasses =
    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";

  const rootInvalidClasses =
    "aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40";

  const rootDisabledClasses = "data-disabled:cursor-not-allowed data-disabled:opacity-50";

  const rootShadowClasses = "shadow-[inset_0_1px_2px_rgb(0_0_0_/_0.18)]";

  const thumbBaseClasses =
    "pointer-events-none block size-[18px] shrink-0 rounded-full bg-white transition-transform duration-200 ease-out will-change-transform";

  const thumbShadowClasses = "shadow-[0_1px_3px_rgb(0_0_0_/_0.25)]";

  const thumbStateClasses = "data-[state=unchecked]:translate-x-[3px]";

  const thumbTranslateClasses = "data-[state=checked]:translate-x-[19px]";

  const thumbRtlClasses = "rtl:data-[state=checked]:-translate-x-[18px]";

  let {
    ref = $bindable(null),
    class: className,
    checked = $bindable(false),
    ...restProps
  }: WithoutChildrenOrChild<SwitchPrimitive.RootProps> = $props();
</script>

<SwitchPrimitive.Root
  bind:ref
  bind:checked
  data-slot="switch"
  class={cn(
    rootBaseClasses,
    rootStateClasses,
    rootFocusClasses,
    rootInvalidClasses,
    rootDisabledClasses,
    rootShadowClasses,
    className,
  )}
  {...restProps}
>
  <SwitchPrimitive.Thumb
    data-slot="switch-thumb"
    class={cn(
      thumbBaseClasses,
      thumbShadowClasses,
      thumbStateClasses,
      thumbTranslateClasses,
      thumbRtlClasses,
    )}
  />
</SwitchPrimitive.Root>
