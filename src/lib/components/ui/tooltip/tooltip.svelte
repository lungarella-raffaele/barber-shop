<script lang="ts">
  import { TOOLTIP_DELAY } from "$lib/constants";
  import { Tooltip as TooltipPrimitive } from "bits-ui";

  import TooltipProvider from "./tooltip-provider.svelte";

  let { open = $bindable(false), ...restProps }: TooltipPrimitive.RootProps = $props();
</script>

<TooltipProvider delayDuration={TOOLTIP_DELAY}>
  <TooltipPrimitive.Root bind:open {...restProps} />
</TooltipProvider>
