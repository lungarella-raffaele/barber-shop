export type Service = {
	name: string;
	duration: string;
	price: number;
	description: string;
};

export const services: Service[] = [
	{
		name: 'Taglio Base',
		duration: '30',
		price: 22,
		description:
			'Taglio classico eseguito con tecniche avanzate di precisione geometrica. Comprende shampoo pre e post servizio.'
	},
	{
		name: 'Taglio Base + Rifinitura Barba',
		duration: '30',
		price: 23,
		description:
			'Ideale per barbe corte rifinite a macchinetta. Include un taglio classico e la definizione accurata della barba.'
	},
	{
		name: 'Taglio + Scolpitura Barba',
		duration: '45',
		price: 25,
		description:
			'Pensato per barbe lunghe, combina un taglio tradizionale con una scolpitura e definizione dettagliata della barba.'
	},
	{
		name: 'Taglio Bambino (0-10 anni)',
		duration: '15',
		price: 15,
		description:
			'Taglio studiato per i più piccoli, fino a 10 anni, con un’attenzione particolare al comfort e alla precisione.'
	},
	{
		name: 'Taglio Ragazzo (11-13 anni)',
		duration: '30',
		price: 18,
		description:
			'Servizio dedicato ai ragazzi di età compresa tra 11 e 13 anni, con uno stile moderno e curato.'
	}
];
