import Description from './alert-description.svelte';
import Title from './alert-title.svelte';
import Root from './alert.svelte';
// @ts-expect-error this error happens only on ts
export { alertVariants, type AlertVariant } from './alert.svelte';

export {
	//
	Root as Alert,
	Description as AlertDescription,
	Title as AlertTitle,
	Description,
	Root,
	Title
};
