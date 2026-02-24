<script lang="ts">
  import { AlertDialog as AlertDialogPrimitive } from "bits-ui";

  const { ...restProps }: AlertDialogPrimitive.PortalProps = $props();
</script>

<AlertDialogPrimitive.Portal {...restProps} />
