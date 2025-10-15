import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { logger } from '$lib/server/logger';
import { getBoolean, getNumber, getString } from '$lib/utils';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { KindService } from '@service/kind.service';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return error(500);
	}

	const kinds = await new KindService().getByStaff(locals.user.data.id);
	if (!kinds) {
		return error(500);
	}
	return {
		banner: await db.select().from(table.banner).where(eq(table.banner.id, 1)).get(),
		kinds
	};
};

export const actions: Actions = {
	updateBanner: async ({ request }) => {
		const data = await request.formData();

		const message = getString(data, 'message');
		const visible = getBoolean(data, 'visible');

		await db.update(table.banner).set({ message, visible }).where(eq(table.banner.id, 1));
	},
	updateKind: async ({ request, locals }) => {
		const data = await request.formData();

		const id = getString(data, 'id');
		const name = getString(data, 'name');
		const description = getString(data, 'description');
		const duration = getNumber(data, 'duration');
		const price = getNumber(data, 'price');
		const active = getBoolean(data, 'active');

		if (!id || !name || !description || !duration || !price) {
			return {
				isUpdatingKind: true,
				success: false
			};
		}

		const kinds = new KindService();
		if (!locals.user) {
			return {
				success: false
			};
		}

		const staffID = locals.user.data.id;
		const response = await kinds.update({
			id,
			name,
			description,
			duration,
			price,
			active,
			staffID
		});

		if (response) {
			return {
				isUpdatingKind: true,
				success: true
			};
		} else {
			return {
				isUpdatingKind: true,
				success: false
			};
		}
	},
	addKind: async ({ request, locals }) => {
		const data = await request.formData();

		const name = getString(data, 'name');
		const description = getString(data, 'description');
		const duration = getNumber(data, 'duration');
		const price = getNumber(data, 'price');
		const active = getBoolean(data, 'active');

		if (!locals.user) {
			return {
				success: false
			};
		}

		const staffID = locals.user.data.id;

		if (!name || !description || !duration || !price) {
			logger.error('Data is not enough to add a kind');
			return {
				isAddingKind: true,
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
			active,
			staffID
		});

		if (response) {
			return {
				isAddingKind: true,
				success: true
			};
		} else {
			logger.error('Could not add service');
			return {
				isAddingKind: true,
				success: false
			};
		}
	},
	deleteKind: async ({ request }) => {
		const data = await request.formData();

		const id = getString(data, 'id');

		if (!id) {
			logger.error('Id not sent');
			return {
				isDeletingKind: true,
				success: false
			};
		}

		const kinds = new KindService();
		const response = await kinds.delete(id);

		if (response) {
			logger.info('Delete kind' + `${response.name}`);
			return {
				isDeletingKind: true,
				success: true
			};
		} else {
			logger.error('Could not add kind');
			return {
				isDeletingKind: true,
				success: false
			};
		}
	}
};
