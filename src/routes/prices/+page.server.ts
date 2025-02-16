import type { PageServerLoad } from './$types.js';
import { getAllServices } from '$lib/server/backend/services.js';

export const load: PageServerLoad = async () => {
	return {
		services: await getAllServices(),
		title: 'Listino Prezzi | ',
		header: 'Listino Prezzi'
	};
};
