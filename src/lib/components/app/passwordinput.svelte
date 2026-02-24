<script lang="ts">
  import { Eye, EyeClosed } from "$lib/components/icons/index";
  import * as ButtonGroup from "$lib/components/ui/button-group/index";
  import * as InputGroup from "$lib/components/ui/input-group/index";
  import { mergeProps, type WithElementRef } from "bits-ui";
  import type { HTMLInputAttributes } from "svelte/elements";

  import Button from "../ui/button/button.svelte";
  import * as Tooltip from "../ui/tooltip";

  type Props = WithElementRef<Omit<HTMLInputAttributes, "type" | "files">>;

  let {
    ref = $bindable(null),
    value = $bindable(),
    class: className,
    ...restProps
  }: Props = $props();

  let isPassVisible = $state(false);
  const togglePasswordVisibility = () => {
    isPassVisible = !isPassVisible;
  };
</script>

<ButtonGroup.Root class="w-full">
  <InputGroup.Root>
    <InputGroup.Input
      bind:ref
      class={className}
      autocomplete="current-password"
      bind:value
      type={isPassVisible ? "text" : "password"}
      {...restProps}
    ></InputGroup.Input>
  </InputGroup.Root>

  <Tooltip.Root>
    <Tooltip.Trigger>
      {#snippet child({ props })}
        {@const mergedProps = mergeProps({ onclick: togglePasswordVisibility }, props)}
        <Button
          aria-label={isPassVisible ? "Nascondi password" : "Mostra password"}
          type="button"
          variant="outline"
          {...mergedProps}
        >
          {#if isPassVisible}
            <Eye />
          {:else}
            <EyeClosed />
          {/if}
        </Button>
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Content>{isPassVisible ? "Nascondi password" : "Mostra password"}</Tooltip.Content>
  </Tooltip.Root>
</ButtonGroup.Root>
