import { type DateValue } from '@internationalized/date';
import { getContext, hasContext, setContext } from 'svelte';

export default class ReservationManager {
	static #contextID = 'reservation-manager';

	tabs: { value: Tabs; label: string }[] = [];
	#index: number = $derived(this.tabs.findIndex((el) => el.value === this.tab) ?? 0);
	tab: Tabs = $state('date');

	name: string = $state('');
	surname: string = $state('');
	date: DateValue | undefined = $state();
	hour: string = $state('');
	email: string = $state('');

	//TODO
	service: string = $state('1');

	message: string | undefined = $state();

	private constructor() {
		this.date = undefined;
		this.hour = '';
		this.email = '';
		this.service = '1';
		this.tabs = [
			{ value: 'date', label: 'Data' },
			{ value: 'service', label: 'Servizi' },
			{ value: 'info', label: 'Informazioni' }
		];
	}

	static istance(): ReservationManager {
		if (hasContext(this.#contextID)) {
			return getContext(this.#contextID);
		} else {
			return setContext(this.#contextID, new ReservationManager());
		}
	}

	check(): boolean {
		if (!this.date || !this.hour) {
			this.message = 'Devi inserire una data per poter proseguire';
			this.goToTab('date');
			return true;
		} else if (!this.service) {
			this.message = 'Devi inserire un servizio per poter proseguire';
			this.goToTab('service');
			return true;
		} else {
			return false;
		}
	}

	next() {
		this.message = undefined;
		this.tab = this.tabs[this.#index + 1].value;
	}

	back() {
		this.message = undefined;
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
