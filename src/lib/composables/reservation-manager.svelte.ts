import { reservation } from '@schema';
import { type DateValue } from '@internationalized/date';
import { getContext, hasContext, setContext } from 'svelte';
import { toast } from 'svelte-sonner';
import { type Tab } from '../models/tabs';

export default class ReservationManager {
	static #contextID = 'reservation-manager';

	tabs: Tab[] = [];
	#index: number = $derived(this.tabs.findIndex((el) => el === this.currentTab) ?? 0);
	currentTab: Tab | undefined = $state();

	date: DateValue | undefined = $state();
	hour: string = $state('');
	selectedService = $state('');

	name: string = $state('');
	email: string = $state('');
	phone: string = $state('');

	isLogged: boolean = $state(false);

	/**
	 * Creates a singleton
	 */
	static instance(isLogged: boolean): ReservationManager {
		if (hasContext(this.#contextID)) {
			console.warn('ReservationManager already created');
			return getContext(this.#contextID);
		} else {
			return setContext(this.#contextID, new ReservationManager(isLogged));
		}
	}

	/**
	 * @returns An instance of a ReservationManager singleton
	 */
	static get() {
		return getContext<ReservationManager>(this.#contextID);
	}

	/**
	 * Checks wheter all the info has been filled, moves the view to invalid tabs and pops up an error toaster
	 * @returns true if the values are all inserted
	 */
	check(): boolean {
		const schema = reservation.safeParse({
			name: this.name,
			hour: this.hour,
			service: this.selectedService,
			email: this.email,
			date: this.date?.toString()
		});

		if (schema.success) {
			return false;
		}

		const { path } = schema.error.issues[0];

		if (path.includes('date')) {
			toast.warning('Devi scegliere una data per poter proseguire');
			this.goToTab('date');
			return true;
		} else if (path.includes('hour')) {
			toast.warning('Devi scegliere un orario per poter proseguire');
			this.goToTab('date');
			return true;
		} else if (path.includes('service')) {
			toast.warning('Devi scegliere un servizio per poter proseguire');
			this.goToTab('service');
			return true;
		} else if ((path.includes('email') || path.includes('name')) && !this.isLogged) {
			toast.warning('Devi inserire un nome e una mail valida');
			this.goToTab('info');
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Goes ahead in the tabs
	 */
	next() {
		this.currentTab = this.tabs[this.#index + 1];
	}

	/**
	 * Goes backward in the tabs
	 */
	back() {
		this.currentTab = this.tabs[this.#index - 1];
	}

	/**
	 * @returns true if the current tab is the first, false otherwise
	 */
	isFirst() {
		if (this.#index === 0) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * @returns true if the current tab is the last, false otherwise
	 */
	isLast() {
		if (this.#index === this.tabs.length - 1) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Go to a specific tab
	 * @param tab Target tab
	 */
	goToTab(tab: Tab) {
		this.currentTab = tab;
	}

	private constructor(isLogged: boolean) {
		this.date = undefined;
		this.hour = '';
		this.name = '';
		this.email = '';
		this.isLogged = isLogged;

		// Info only present if the user is not logged
		if (!this.isLogged) this.tabs.push('info');

		this.tabs.push('service');
		this.tabs.push('date');
		this.currentTab = this.tabs[0];
	}
}
