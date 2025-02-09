import type { Actions } from './$types';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { banner: await db.select().from(table.banner).where(eq(table.banner.id, 1)).get() };
};
export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const message = data.get('message') as string;

		// Convert to boolean
		const visible = (data.get('visible') as string) === 'on';

		await db.update(table.banner).set({ message, visible }).where(eq(table.banner.id, 1));
	}
};
