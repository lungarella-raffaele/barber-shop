import { type DateValue } from '@internationalized/date';
import { getContext, hasContext, setContext } from 'svelte';
import { toast } from 'svelte-sonner';
import { type TabContent, type Service } from './tabs';

export default class ReservationManager {
	static #contextID = 'reservation-manager';

	tabs: TabContent[] = [];
	#index: number = $derived(this.tabs.findIndex((el) => el === this.currentTab) ?? 0);
	currentTab: TabContent | undefined = $state();

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
		this.tabs.push('service');
		this.tabs.push('date');
		this.currentTab = this.tabs[0];
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
		this.currentTab = this.tabs[this.#index + 1];
	}

	back() {
		this.currentTab = this.tabs[this.#index - 1];
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

	goToTab(tab: TabContent) {
		this.currentTab = tab;
	}
}
