import type { Service } from './schema';
import { getAllServices, insertService } from '../backend/services-service';
import { logger } from '../logger';

import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

export const init = async () => {
	const result = await getAllServices();
	if (result.length === 0) {
		services.forEach(async (ser) => {
			await insertService(ser);
		});
	}

	db.insert(table.banner).values({ id: 1, message: '', visible: false });

	logger.info('Services table seeded successfully!');
};

const services: Service[] = [
	{
		id: '1',
		name: 'Taglio Base',
		duration: 30,
		price: 22,
		description:
			'Taglio classico eseguito con tecniche avanzate di precisione geometrica. Comprende shampoo pre e post servizio.'
	},
	{
		id: '2',
		name: 'Taglio Base + Rifinitura Barba',
		duration: 30,
		price: 23,
		description:
			'Ideale per barbe corte rifinite a macchinetta. Include un taglio classico e la definizione accurata della barba.'
	},
	{
		id: '3',
		name: 'Taglio + Scolpitura Barba',
		duration: 45,
		price: 25,
		description:
			'Pensato per barbe lunghe, combina un taglio tradizionale con una scolpitura e definizione dettagliata della barba.'
	},
	{
		id: '4',
		name: 'Taglio Bambino (0-10 anni)',
		duration: 15,
		price: 15,
		description:
			'Taglio studiato per i più piccoli, fino a 10 anni, con un’attenzione particolare al comfort e alla precisione.'
	},
	{
		id: '5',
		name: 'Taglio Ragazzo (11-13 anni)',
		duration: 30,
		price: 18,
		description:
			'Servizio dedicato ai ragazzi di età compresa tra 11 e 13 anni, con uno stile moderno e curato.'
	}
];
