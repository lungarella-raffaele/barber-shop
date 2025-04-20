import Root from './toggle.svelte';
export {
	// @ts-expect-error this error happens only on ts
	toggleVariants,
	// @ts-expect-error this error happens only on ts
	type ToggleSize,
	// @ts-expect-error this error happens only on ts
	type ToggleVariant,
	// @ts-expect-error this error happens only on ts
	type ToggleVariants
} from './toggle.svelte';

export {
	Root,
	//
	Root as Toggle
};
