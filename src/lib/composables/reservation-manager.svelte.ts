import { type DateValue } from '@internationalized/date';
import { getContext, hasContext, setContext } from 'svelte';
import { toast } from 'svelte-sonner';

type Service = {
	id: string;
	name: string;
	description: string;
	duration: number;
	price: number;
};

export default class ReservationManager {
	static #contextID = 'reservation-manager';

	tabs: { value: Tabs; label: string }[] = [];
	#index: number = $derived(this.tabs.findIndex((el) => el.value === this.tab) ?? 0);
	tab: Tabs = $state('date');

	// name: string = $state('');
	// surname: string = $state('');
	// email: string = $state('');
	date: DateValue | undefined = $state();
	hour: string = $state('');

	selectedService = $state('0');
	services: Service[] = $state([]);
	service: Service | undefined = $derived(
		this.services.find((el) => el.id === this.selectedService)
	);

	private constructor(services: Service[]) {
		this.date = undefined;
		this.hour = '';
		this.tabs = [
			{ value: 'date', label: 'Data' },
			{ value: 'service', label: 'Servizi' }
		];
		this.services = services;
	}

	static istance(services: Service[]): ReservationManager {
		if (hasContext(this.#contextID)) {
			return getContext(this.#contextID);
		} else {
			return setContext(this.#contextID, new ReservationManager(services));
		}
	}

	static get() {
		return getContext<ReservationManager>(this.#contextID);
	}

	check(): boolean {
		if (!this.date || !this.hour) {
			toast.error('Devi inserire una data per poter proseguire');
			this.goToTab('date');
			return true;
		} else if (!this.service) {
			toast.error('Devi inserire un servizio per poter proseguire ');
			this.goToTab('service');
			return true;
		} else {
			return false;
		}
	}

	next() {
		this.tab = this.tabs[this.#index + 1].value;
	}

	back() {
		this.tab = this.tabs[this.#index - 1].value;
	}

	isFirst() {
		if (this.#index === 0) {
			return true;
		} else {
			return false;
		}
	}

	isLast() {
		if (this.#index === this.tabs.length - 1) {
			return true;
		} else {
			return false;
		}
	}

	goToTab(tab: Tabs) {
		this.tab = tab;
	}
}

type Tabs = 'date' | 'service' | 'info';
