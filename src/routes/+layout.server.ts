import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const success = url.searchParams.get('success');
	return { user: locals.user, title: 'Home | ', success };
};
