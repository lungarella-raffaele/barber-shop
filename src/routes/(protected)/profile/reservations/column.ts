import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
import {
	CalendarDate,
	DateFormatter,
	getLocalTimeZone,
	parseDate,
	today
} from '@internationalized/date';
import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import DatatableActions from './datatableactions.svelte';

type Reservation = {
	id: string;
	date: string | null;
	userID: string;
	serviceID: string;
};

export const columns: ColumnDef<Reservation>[] = [
	{
		accessorKey: 'id',
		header: () => {
			const codeSnippet = createRawSnippet(() => ({
				render: () => `<div class="text-left">Codice</div>`
			}));
			return renderSnippet(codeSnippet, '');
		},
		cell: ({ row }) => {
			const idSnippet = createRawSnippet<[string]>((getId) => {
				const shortID = getId();
				return {
					render: () => `<div class="text-left font-medium uppercase w-20">${shortID}</div>`
				};
			});

			const sliceID = (id: string) => {
				return id.slice(0, 8);
			};

			return renderSnippet(idSnippet, sliceID(row.getValue('id')));
		}
	},
	{
		accessorKey: 'date',
		header: 'Data',
		cell: ({ row }) => {
			const dateSnippet = createRawSnippet<[string]>((getDate) => {
				const date = getDate();
				return {
					render: () => `<div class="text-left font-medium">${date}</div>`
				};
			});

			const df = new DateFormatter('it-IT', {
				dateStyle: 'long'
			});

			const formatDate = (date: string) => {
				let dateValue: CalendarDate = today(getLocalTimeZone());
				try {
					const cleanedDate = date.replace(/^"|"$/g, '');
					dateValue = parseDate(cleanedDate);
				} catch (e) {
					return '';
				}
				return df.format(dateValue.toDate(getLocalTimeZone()));
			};

			return renderSnippet(dateSnippet, formatDate(row.getValue('date')));
		}
	},
	{
		accessorKey: 'serviceID',
		header: 'Servizio'
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			// You can pass whatever you need from `row.original` to the component
			return renderComponent(DatatableActions, { id: row.original.id });
		}
	}
];
