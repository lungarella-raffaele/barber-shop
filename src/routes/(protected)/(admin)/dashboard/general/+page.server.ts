import { getAllServices, updateService } from '$lib/server/backend/services';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { getBoolean, getNumber, getString } from '$lib/utils';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		banner: await db.select().from(table.banner).where(eq(table.banner.id, 1)).get(),
		services: await getAllServices(false)
	};
};
export const actions: Actions = {
	updateBanner: async ({ request }) => {
		const data = await request.formData();

		const message = getString(data, 'message');
		const visible = getBoolean(data, 'visible');

		await db.update(table.banner).set({ message, visible }).where(eq(table.banner.id, 1));
	},
	updateService: async ({ request }) => {
		const data = await request.formData();

		const id = getString(data, 'id');
		const name = getString(data, 'name');
		const description = getString(data, 'description');
		const duration = getNumber(data, 'duration');
		const price = getNumber(data, 'price');
		const inactive = getBoolean(data, 'inactive');

		if (!id || !name || !description || !duration || !price) {
			return {
				success: false
			};
		}

		const response = await updateService({
			id,
			name,
			description,
			duration,
			price,
			inactive
		});

		if (response) {
			return {
				success: true
			};
		} else {
			return {
				success: false
			};
		}
	}
};
