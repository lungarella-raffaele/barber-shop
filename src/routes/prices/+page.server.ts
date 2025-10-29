import type { PageServerLoad } from './$types.js';
import { KindService } from '@service/kind.service.js';
import { StaffService } from '@service/staff.service.js';

export const load: PageServerLoad = async () => {
	return {
		kinds: new KindService().getAll(),
		staff: new StaffService().getAll(),
		title: 'Listino Prezzi -',
		header: 'Listino Prezzi'
	};
};
