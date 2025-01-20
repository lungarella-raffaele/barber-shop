import type { PageServerLoad } from './$types.js';
import { getAllServices } from '$lib/server/backend/services-service.js';

export const load: PageServerLoad = async () => {
	return {
		services: await getAllServices()
	};
};
