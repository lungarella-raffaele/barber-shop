import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const reservation = await db
		.select()
		.from(table.reservation)
		.where(eq(table.reservation.id, params.code));
	return { reservation: reservation[0] };
};
