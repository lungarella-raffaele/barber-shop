import { expect } from '@playwright/test';
import { render } from '@testing-library/svelte';
import { describe, it } from 'vitest';
import type { PageData } from './$types';
import Page from './+page.svelte';

describe('New reservation page', () => {
	it('should render three steps for not authenticated users', () => {
		const { getAllByRole } = render(Page, { props: { data: noUserProps } });
		const tabs = getAllByRole('tab');
		expect(tabs.length).toEqual(3);

		const firstTab = tabs[0].attributes;
		// First item should be active
		expect(firstTab.getNamedItem('data-state')?.value).toEqual('active');

		// First item should be info
		expect(firstTab.getNamedItem('data-value')?.value).toEqual('info');
	});
	it('should only render two steps if the user is logged in', () => {
		const { getAllByRole } = render(Page, { props: { data: userProps } });
		const tabs = getAllByRole('tab');
		expect(tabs.length).toEqual(2);

		// First item should be active
		expect(tabs[0].attributes.getNamedItem('data-state')?.value).toEqual('active');
		expect(tabs[0].attributes.getNamedItem('data-value')?.value).toEqual('kind');
	});
});

const userProps: PageData = {
	banner: null,
	currentReservations: [],
	kinds: new Promise((resolve) => {
		resolve([
			{
				id: '1',
				name: 'Haircut',
				description: 'Nice haircut',
				duration: 30,
				price: 22,
				active: false,
				staffID: 'emiliano'
			}
		]);
	}),
	user: {
		data: {
			id: 'user-id',
			name: 'John Doe',
			phoneNumber: '333',
			email: 'johndoes@test.com',
			passwordHash: 'axsdqeow',
			verifiedEmail: false,
			expiresAt: new Date()
		},
		role: 'user'
	},
	title: '',
	shutdown: [],
	schedule: [
		{
			staffID: '345',
			day: 0,
			startHour: 9,
			startMinute: 0,
			endHour: 10,
			endMinute: 30,
			id: 0
		}
	],
	staff: new Promise((resolve) => {
		resolve([{ name: 'emiliano', id: 'emiliano', avatar: 'avatar.png' }]);
	})
};

const noUserProps: PageData = {
	banner: null,
	currentReservations: [],
	kinds: new Promise((resolve) => {
		resolve([
			{
				id: '1',
				name: 'Haircut',
				staffID: 'emiliano',
				description: 'Nice haircut',
				duration: 30,
				price: 22,
				active: false
			}
		]);
	}),
	user: null,
	title: '',
	shutdown: [],
	staff: new Promise((resolve) => {
		resolve([{ name: 'emiliano', id: 'emiliano', avatar: 'avatar.png' }]);
	}),
	schedule: [
		{
			staffID: '345',
			day: 0,
			startHour: 9,
			startMinute: 0,
			endHour: 10,
			endMinute: 30,
			id: 0
		}
	]
};
