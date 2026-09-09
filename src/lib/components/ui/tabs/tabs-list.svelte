<script lang="ts" module>
  import { tv } from "tailwind-variants";

  export const tabsListVariants = tv({
    base: "rounded-xl p-[3px] group-data-horizontal/tabs:h-9 group-data-vertical/tabs:rounded-xl  group/tabs-list text-muted-foreground inline-flex w-fit items-center justify-center group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col",
  });
</script>

<script lang="ts">
  import { Tabs as TabsPrimitive } from "bits-ui";

  let { ref = $bindable(null), class: className, ...restProps }: TabsPrimitive.ListProps = $props();
</script>

<TabsPrimitive.List bind:ref data-slot="tabs-list" class={className} {...restProps} />
