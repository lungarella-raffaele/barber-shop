<script lang="ts">
  import { cn } from "$lib/utils.js";
  import { AlertDialog as AlertDialogPrimitive } from "bits-ui";

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: AlertDialogPrimitive.DescriptionProps = $props();
</script>

<AlertDialogPrimitive.Description
  bind:ref
  data-slot="alert-dialog-description"
  class={cn(
    "text-muted-foreground *:[a]:hover:text-foreground typo-body-sm text-balance md:text-pretty *:[a]:underline *:[a]:underline-offset-3",
    className,
  )}
  {...restProps}
/>
