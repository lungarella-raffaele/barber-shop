import { expect } from '@playwright/test';
import { fireEvent, render } from '@testing-library/svelte';
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
		expect(tabs[0].attributes.getNamedItem('data-value')?.value).toEqual('service');
	});
	it('should display services', () => {
		const { getAllByRole, getByLabelText } = render(Page, { props: { data: userProps } });
		const radios = getAllByRole('radio');

		expect(radios.length).toEqual(userProps.kinds.length);

		const firstRadio = radios[0];
		expect(firstRadio.attributes.getNamedItem('data-state')?.value).toEqual('unchecked');
		const button = getByLabelText('Go to next step');
		fireEvent.click(button);
	});
});

const userProps: PageData = {
	banner: null,
	currentReservations: [],
	kinds: [
		{
			id: '1',
			name: 'Haircut',
			description: 'Nice haircut',
			duration: 30,
			price: 22,
			active: false
		}
	],
	user: {
		id: 'user-id',
		name: 'John Doe',
		phoneNumber: '333',
		email: 'johndoes@test.com',
		passwordHash: 'axsdqeow',
		isAdmin: null,
		verifiedEmail: false,
		expiresAt: new Date()
	},
	title: '',
	closures: []
};

const noUserProps: PageData = {
	banner: null,
	currentReservations: [],
	kinds: [
		{
			id: '1',
			name: 'Haircut',
			description: 'Nice haircut',
			duration: 30,
			price: 22,
			active: false
		}
	],
	user: null,
	title: '',
	closures: []
};
