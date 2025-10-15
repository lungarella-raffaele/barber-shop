import { logger } from '../logger';
import type { DBKind } from './schema';

import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { KindService } from '@service/kind.service';
import { UserService } from '@service/user.service';

export const init = async () => {
	const kinds = new KindService();
	const result = await kinds.getAll();
	const mainStaff = await new UserService().getAllStaff();

	// TODO Adjust
	const emiliano = mainStaff?.find((el) => el.name === 'raffaele');

	if (!emiliano?.id) {
		return;
	}

	if (result?.length === 0) {
		for (const kind of initialKinds(emiliano.id)) {
			await kinds.insert(kind);
		}
		logger.info('Kinds table seeded successfully!');
	}
	db.insert(table.banner).values({ id: 1, message: '', visible: false });
};

const initialKinds = (staffID: string): DBKind[] => {
	return [
		{
			id: '1',
			staffID,
			name: 'Taglio base',
			duration: 30,
			price: 20,
			description: 'Taglio di capelli base per uomo, include lavaggio e styling.',
			active: true
		},
		{
			id: '2',
			staffID,
			name: 'Solo sfumatura',
			duration: 20,
			price: 10,
			description: 'Servizio di sfumatura laterale e posteriore, senza taglio completo.',
			active: true
		},
		{
			id: '3',
			staffID,
			name: 'Taglio più scolpitura barba',
			duration: 45,
			price: 25,
			description:
				'Taglio di capelli completo con servizio di rifinitura e modellamento barba.',
			active: true
		},
		{
			id: '4',
			staffID,
			name: 'Taglio bambino (0-13)',
			duration: 25,
			price: 14,
			description: 'Taglio di capelli per bambini fino a 13 anni di età.',
			active: true
		},
		{
			id: '5',
			staffID,
			name: 'Taglio donna',
			duration: 45,
			price: 20,
			description: 'Taglio di capelli per donna, adatto a tutte le lunghezze.',
			active: true
		},
		{
			id: '6',
			staffID,
			name: 'Colore',
			duration: 60,
			price: 20,
			description: 'Applicazione di un singolo colore su tutta la capigliatura.',
			active: true
		},
		{
			id: '7',
			staffID,
			name: 'Doppio colore',
			duration: 90,
			price: 30,
			description: 'Applicazione di due colori diversi per effetti di contrasto o sfumatura.',
			active: true
		},
		{
			id: '8',
			staffID,
			name: 'Piega corta',
			duration: 20,
			price: 15,
			description: 'Servizio di piega e styling per capelli corti.',
			active: true
		},
		{
			id: '9',
			staffID,
			name: 'Piega lunga',
			duration: 30,
			price: 20,
			description: 'Servizio di piega e styling per capelli lunghi.',
			active: true
		}
	];
};
