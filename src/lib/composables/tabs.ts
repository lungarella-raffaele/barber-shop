export type Service = {
	id: string;
	name: string;
	description: string;
	duration: number;
	price: number;
};

export type TabContent = 'date' | 'service' | 'info';
