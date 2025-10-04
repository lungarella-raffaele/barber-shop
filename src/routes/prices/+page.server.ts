import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { KindService } from '@service';

export const load: PageServerLoad = async () => {
	const kinds = await new KindService().getAll();

	if (!kinds) {
		return error(500);
	}
	return {
		kinds,
		title: 'Listino Prezzi | ',
		header: 'Listino Prezzi'
	};
};
