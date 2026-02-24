<script>
  import * as Alert from "$lib/components/ui/alert";
  import InfoIcon from "@lucide/svelte/icons/info";

  const { message, isPreview = false } = $props();
</script>

<Alert.Root
  class="rounded-none border-x-0 border-t-0 border-b border-blue-200 bg-blue-50/80 px-0 py-2 text-blue-950 backdrop-blur-sm dark:border-accent/30 dark:bg-accent/10 dark:text-blue-50"
>
  <Alert.Description
    class="{!isPreview
      ? 'app-padding'
      : ''} flex items-center mt-2 py-1 gap-2 typo-label text-current"
  >
    <InfoIcon class="size-4 shrink-0 text-blue-600 dark:text-blue-300" aria-hidden="true" />
    <span>{message}</span>
  </Alert.Description>
</Alert.Root>
