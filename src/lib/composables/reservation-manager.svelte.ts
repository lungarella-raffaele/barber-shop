import { parseTime, type DateValue } from '@internationalized/date';
import { getContext, hasContext, setContext } from 'svelte';
import { toast } from 'svelte-sonner';
import { type TabContent, type Service } from './tabs';
import { WORKING_HOURS, type Slot } from '$lib/working-hours';

type CurrentReservation = {
	date: string;
	startingTime: string;
	duration: number;
};

export default class ReservationManager {
	static #contextID = 'reservation-manager';

	tabs: TabContent[] = [];
	#index: number = $derived(this.tabs.findIndex((el) => el === this.currentTab) ?? 0);
	currentTab: TabContent | undefined = $state();

	date: DateValue | undefined = $state();
	slot: string = $state('');

	selectedService = $state('');
	services: Service[] = $state([]);
	service: Service | undefined = $derived(
		this.services.find((el) => el.id === this.selectedService)
	);

	currentReservations: CurrentReservation[];
	closures: { start: string; end: string; id: string }[];
	availableSlots: Slot[] = $derived(this.getSlots());

	name: string = $state('');
	email: string = $state('');

	loggedIn: boolean = $state(false);

	private getSlots(): Slot[] {
		// TODO ADD current service selection
		const selectedDate = this.date;
		if (!selectedDate) {
			return [];
		}

		const reservationsOfSelectedDay = this.currentReservations
			.filter((el) => el.date === selectedDate.toString())
			.map((el) => {
				return { startingTime: el.startingTime, duration: el.duration };
			});

		const slots: Slot[] = [];

		let curr = WORKING_HOURS.start;
		while (WORKING_HOURS.end.compare(curr) > 0) {
			// If we find an element that the slot is reserved
			const reservedSlot = reservationsOfSelectedDay.find(
				(el) => el.startingTime === curr.toString()
			);

			let isAvailable = false;
			if (!reservedSlot) {
				isAvailable = true;
			} else if (reservedSlot && reservedSlot.duration > WORKING_HOURS.slot.minute) {
				// If the slot has a duration of 45 minutes we invalidate the current slot...
				slots.push({ time: curr.toString(), available: false });

				// ...and the next
				curr = curr.add({
					hours: WORKING_HOURS.slot.hour,
					minutes: WORKING_HOURS.slot.minute
				});
				isAvailable = false;
			} else {
				isAvailable = false;
			}

			slots.push({
				time: curr.toString(),
				available: isAvailable
			});

			// Move to next slot
			curr = curr.add({ hours: WORKING_HOURS.slot.hour, minutes: WORKING_HOURS.slot.minute });
		}
		return this.sortSlots(slots);
	}

	private sortSlots(slots: Slot[]): Slot[] {
		return slots.sort((a, b) => {
			return parseTime(a.time).compare(parseTime(b.time));
		});
	}

	static instance(
		services: Service[],
		currentRes: CurrentReservation[],
		loggedIn: boolean,
		closures: { end: string; start: string; id: string }[]
	): ReservationManager {
		if (hasContext(this.#contextID)) {
			return getContext(this.#contextID);
		} else {
			return setContext(
				this.#contextID,
				new ReservationManager(services, currentRes, loggedIn, closures)
			);
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
		if (!this.date || !this.slot) {
			toast.warning('Devi inserire una data per poter proseguire');
			this.goToTab('date');
			return true;
		} else if (!this.service) {
			toast.warning('Devi inserire un servizio per poter proseguire ');
			this.goToTab('service');
			return true;
		} else if ((!this.name || !this.email) && !this.loggedIn) {
			toast.warning('Devi inserire i tuoi nominativi');
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
	goToTab(tab: TabContent) {
		this.currentTab = tab;
	}

	private constructor(
		services: Service[],
		currentRes: CurrentReservation[],
		loggedIn: boolean,
		closures: { start: string; end: string; id: string }[]
	) {
		this.closures = closures;
		this.date = undefined;
		this.slot = '';
		this.name = '';
		this.email = '';
		this.loggedIn = loggedIn;

		if (!this.loggedIn) this.tabs.push('info');

		this.tabs.push('service');
		this.tabs.push('date');
		this.currentTab = this.tabs[0];
		this.services = services;
		this.currentReservations = currentRes;
	}
}
