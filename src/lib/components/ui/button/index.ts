import Root, {
	// @ts-expect-error this error happens only on ts
	type ButtonProps,
	// @ts-expect-error this error happens only on ts
	type ButtonSize,
	// @ts-expect-error this error happens only on ts
	type ButtonVariant,
	// @ts-expect-error this error happens only on ts
	buttonVariants
} from './button.svelte';

export {
	//
	Root as Button,
	buttonVariants,
	Root,
	type ButtonProps,
	type ButtonSize,
	type ButtonVariant,
	type ButtonProps as Props
};
