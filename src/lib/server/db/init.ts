import { getAllServices, insertService } from '../backend/services';
import { logger } from '../logger';
import type { Service } from './schema';

import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

export const init = async () => {
	const result = await getAllServices();
	if (result.length === 0) {
		services.forEach(async (ser) => {
			await insertService(ser);
		});
		logger.info('Services table seeded successfully!');
	}
	db.insert(table.banner).values({ id: 1, message: '', visible: false });
};

// Database entries for salon services
const services: Service[] = [
	{
		id: '1',
		name: 'Taglio base',
		duration: 30,
		price: 20,
		description: 'Taglio di capelli base per uomo, include lavaggio e styling.',
		active: true
	},
	{
		id: '2',
		name: 'Solo sfumatura',
		duration: 20,
		price: 10,
		description: 'Servizio di sfumatura laterale e posteriore, senza taglio completo.',
		active: true
	},
	{
		id: '3',
		name: 'Taglio più scolpitura barba',
		duration: 45,
		price: 25,
		description: 'Taglio di capelli completo con servizio di rifinitura e modellamento barba.',
		active: true
	},
	{
		id: '4',
		name: 'Taglio bambino (0-13)',
		duration: 25,
		price: 14,
		description: 'Taglio di capelli per bambini fino a 13 anni di età.',
		active: true
	},
	{
		id: '5',
		name: 'Taglio donna',
		duration: 45,
		price: 20,
		description: 'Taglio di capelli per donna, adatto a tutte le lunghezze.',
		active: true
	},
	{
		id: '6',
		name: 'Colore',
		duration: 60,
		price: 20,
		description: 'Applicazione di un singolo colore su tutta la capigliatura.',
		active: true
	},
	{
		id: '7',
		name: 'Doppio colore',
		duration: 90,
		price: 30,
		description: 'Applicazione di due colori diversi per effetti di contrasto o sfumatura.',
		active: true
	},
	{
		id: '8',
		name: 'Piega corta',
		duration: 20,
		price: 15,
		description: 'Servizio di piega e styling per capelli corti.',
		active: true
	},
	{
		id: '9',
		name: 'Piega lunga',
		duration: 30,
		price: 20,
		description: 'Servizio di piega e styling per capelli lunghi.',
		active: true
	}
];
