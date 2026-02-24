<script lang="ts" module>
  import { cn, type WithElementRef } from "$lib/utils.js";
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
  import { type VariantProps, tv } from "tailwind-variants";

  export const buttonVariants = tv({
    base: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-xl border border-transparent bg-clip-padding typo-label focus-visible:ring-[3px] enabled:active:scale-[0.98] aria-invalid:ring-[3px] [&_svg:not([class*='size-'])]:size-4 group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 cursor-pointer disabled:cursor-not-allowed aria-disabled:cursor-not-allowed",
    variants: {
      variant: {
        default:
          "bg-foreground/92 text-background not-disabled:hover:bg-foreground aria-disabled:hover:bg-foreground",
        outline:
          "border-border bg-gray-2 not-disabled:hover:bg-gray-3 not-disabled:hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground aria-disabled:hover:bg-input/30",
        secondary:
          "bg-secondary text-secondary-foreground not-disabled:hover:bg-gray-4 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground aria-disabled:hover:bg-secondary",
        ghost:
          "not-disabled:hover:bg-muted not-disabled:hover:text-foreground dark:not-disabled:hover:bg-muted/80 aria-disabled:hover:bg-transparent aria-disabled:hover:text-current dark:aria-disabled:hover:bg-transparent",
        destructive:
          "bg-destructive/10 not-disabled:hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/20 text-destructive focus-visible:border-destructive/40 dark:not-disabled:hover:bg-destructive/30 aria-disabled:hover:bg-destructive/10 dark:aria-disabled:hover:bg-destructive/20",
        link: "text-accent underline-offset-4 not-disabled:hover:underline aria-disabled:hover:no-underline px-0! mx-0!",
        icon: "text-muted-foreground hover:text-foreground border-border bg-gray-2 not-disabled:hover:bg-gray-3 not-disabled:hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground aria-disabled:hover:bg-input/30",
      },
      size: {
        default:
          "h-9 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        xs: "h-6 gap-1 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        lg: "h-10 gap-1.5 px-6 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-8 rounded-full",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  });

  export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
  export type ButtonSize = VariantProps<typeof buttonVariants>["size"];

  export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
    WithElementRef<HTMLAnchorAttributes> & {
      variant?: ButtonVariant;
      size?: ButtonSize;
    };
</script>

<script lang="ts">
  let {
    class: className,
    variant = "default",
    size = "default",
    ref = $bindable(null),
    href = undefined,
    type = "button",
    disabled,
    children,
    ...restProps
  }: ButtonProps = $props();
</script>

{#if href}
  <a
    bind:this={ref}
    data-slot="button"
    class={cn(buttonVariants({ variant, size }), disabled && "cursor-not-allowed", className)}
    href={disabled ? undefined : href}
    aria-disabled={disabled}
    role={disabled ? "link" : undefined}
    tabindex={disabled ? -1 : undefined}
    {...restProps}
  >
    {@render children?.()}
  </a>
{:else}
  <button
    bind:this={ref}
    data-slot="button"
    class={cn(buttonVariants({ variant, size }), className)}
    {type}
    {disabled}
    {...restProps}
  >
    {@render children?.()}
  </button>
{/if}
