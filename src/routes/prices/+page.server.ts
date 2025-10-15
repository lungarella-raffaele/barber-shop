import type { PageServerLoad } from './$types.js';
import { KindService } from '@service/kind.service.js';
import { UserService } from '@service/user.service.js';

export const load: PageServerLoad = async () => {
	return {
		kinds: new KindService().getAll(),
		staff: new UserService().getAllStaff(),
		title: 'Listino Prezzi | ',
		header: 'Listino Prezzi'
	};
};
