import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { logger } from '$lib/server/logger';
import { getBoolean, getNumber, getString } from '$lib/utils';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { KindService } from '@service';

export const load: PageServerLoad = async () => {
	const kinds = new KindService();
	return {
		banner: await db.select().from(table.banner).where(eq(table.banner.id, 1)).get(),
		kinds: await kinds.getAll(false)
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
		const active = getBoolean(data, 'active');

		if (!id || !name || !description || !duration || !price) {
			return {
				isUpdatingService: true,
				success: false
			};
		}

		const kinds = new KindService();
		const response = await kinds.update({
			id,
			name,
			description,
			duration,
			price,
			active
		});

		if (response) {
			return {
				isUpdatingService: true,
				success: true
			};
		} else {
			return {
				isUpdatingService: true,
				success: false
			};
		}
	},
	addService: async ({ request }) => {
		const data = await request.formData();

		const name = getString(data, 'name');
		const description = getString(data, 'description');
		const duration = getNumber(data, 'duration');
		const price = getNumber(data, 'price');
		const active = getBoolean(data, 'active');

		if (!name || !description || !duration || !price) {
			logger.error('Data is not enough to add a service');
			return {
				isAddingService: true,
				success: false
			};
		}

		const kinds = new KindService();
		const response = await kinds.insert({
			id: crypto.randomUUID(),
			name,
			description,
			duration,
			price,
			active
		});

		if (response) {
			return {
				isAddingService: true,
				success: true
			};
		} else {
			logger.error('Could not add service');
			return {
				isAddingService: true,
				success: false
			};
		}
	},
	deleteService: async ({ request }) => {
		const data = await request.formData();

		const id = getString(data, 'id');

		if (!id) {
			logger.error('Id not sent');
			return {
				isDeletingService: true,
				success: false
			};
		}

		const kinds = new KindService();
		const response = await kinds.delete(id);

		if (response) {
			logger.info('Delete service' + `${response.name}`);
			return {
				isDeletingService: true,
				success: true
			};
		} else {
			logger.error('Could not add service');
			return {
				isDeletingService: true,
				success: false
			};
		}
	}
};
