import { reservationSchema as schema } from '$lib/modules/zod-schemas';
import type { DateValue } from '@internationalized/date';
import { getContext, hasContext, setContext } from 'svelte';
import type { Tab } from '@types';

import { toast } from 'svelte-sonner';

export type Data = {
	hour: string;
	date: DateValue | undefined;
	kind: string;
	staff: string;
	name: string;
	email: string;
	phone: string;
};

export default class ReservationManager {
	tabs: Tab[] = [];
	currentTab: Tab | undefined = $state();
	data: Data = $state({} as Data);

	isLogged: boolean;

	errorIDs: string[] = $state([]);

	static #contextID = 'reservation-manager';
	#index: number = $derived(this.tabs.findIndex((el) => el === this.currentTab) ?? 0);

	/** Creates a singleton */
	static instance(isLogged: boolean): ReservationManager {
		if (hasContext(this.#contextID)) {
			console.warn('ReservationManager already created');
			return getContext(this.#contextID);
		} else {
			return setContext(this.#contextID, new ReservationManager(isLogged));
		}
	}

	/** @returns An instance of a ReservationManager singleton */
	static get() {
		return getContext<ReservationManager>(this.#contextID);
	}

	/**
	 * Checks wheter all the info has been filled, moves the view to invalid tabs
	 * and pops up an error toaster @returns true if the values are all inserted
	 */
	check() {
		const data = {
			...this.data,
			date: this.data.date?.toString()
		};
		const parse = schema.safeParse(data);

		if (parse.success) {
			return true;
		}

		const { path } = parse.error.issues[0];

		if (path.includes('date') || path.includes('hour')) {
			toast.warning('Devi scegliere una data o un orario per poter proseguire');
			this.goToTab('date');
		} else if (path.includes('kind')) {
			toast.warning('Devi scegliere un servizio per poter proseguire');
			this.goToTab('kind');
		} else if ((path.includes('email') || path.includes('name')) && !this.isLogged) {
			toast.warning('Devi inserire un nome e una mail valida');
			this.goToTab('info');
		}

		return false;
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
		this.isLogged = isLogged;

		this.data = {
			hour: '',
			date: undefined,
			kind: '',
			staff: '',
			name: '',
			email: '',
			phone: ''
		};

		// Info only present if the user is not logged
		if (!this.isLogged) this.tabs.push('info');

		this.tabs.push('kind');
		this.tabs.push('date');
		this.currentTab = this.tabs[0];
	}
}
