import Page from './+page.svelte';
import type { PageData } from './$types';
import { describe, it } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import { expect } from '@playwright/test';

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

		expect(radios.length).toEqual(userProps.services.length);

		const firstRadio = radios[0];
		expect(firstRadio.attributes.getNamedItem('data-state')?.value).toEqual('unchecked');
		const button = getByLabelText('Go to next step');
		fireEvent.click(button);
	});
});

const userProps: PageData = {
	banner: undefined,
	currentReservations: [],
	services: [
		{
			id: '1',
			name: 'Haircut',
			description: 'Nice haircut',
			duration: 30,
			price: 22
		}
	],
	user: {
		id: 'user-id',
		name: 'John Doe',
		phoneNumber: '333',
		email: 'johndoes@test.com',
		passwordHash: 'axsdqeow',
		isAdmin: null,
		pending: false
	},
	form: {
		id: '',
		valid: false,
		posted: false,
		data: {
			date: '',
			name: '',
			email: '',
			service: '',
			surname: '',
			slot: ''
		},
		constraints: undefined,
		message: undefined,
		shape: undefined,
		errors: {}
	},
	title: '',
	closures: []
};

const noUserProps: PageData = {
	banner: undefined,
	currentReservations: [],
	services: [
		{
			id: '1',
			name: 'Haircut',
			description: 'Nice haircut',
			duration: 30,
			price: 22
		}
	],
	user: null,
	form: {
		id: '',
		valid: false,
		posted: false,
		data: {
			date: '',
			name: '',
			email: '',
			service: '',
			surname: '',
			slot: ''
		},
		constraints: undefined,
		message: undefined,
		shape: undefined,
		errors: {}
	},
	title: '',
	closures: []
};
