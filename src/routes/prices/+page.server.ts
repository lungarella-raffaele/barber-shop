import type { PageServerLoad } from './$types.js';
import { KindService } from '@services/kind.service.js';

export const load: PageServerLoad = async () => {
	return {
		services: await new KindService().getAll(),
		title: 'Listino Prezzi | ',
		header: 'Listino Prezzi'
	};
};
