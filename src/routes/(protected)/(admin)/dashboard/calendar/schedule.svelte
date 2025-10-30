<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';
	import type { ScheduleRange } from '@types';
	import { Day, getWeekDay } from '$lib/enums/days';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Time } from '@internationalized/date';
	import { onMount } from 'svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { convertTimeFormat, formatTime, parseTimeString, toMinutes } from '$lib/utils';
	import type { DBSchedule, Schedule } from '$lib/server/db/schema';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import { LoaderCircle, Pencil, Save, X } from '$lib/components/icons/index';
	import { Trash } from '$lib/components/icons/index';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { initializeEmptyMap, mapToDB, mapToUI, validateRange } from './ranges';

	const { schedule, staffID }: { schedule: Promise<DBSchedule[] | null>; staffID: string } =
		$props();

	const isMobile = new IsMobile(900);

	type Action = 'add' | 'edit';
	let action: Action = $state('add');
	let editingIndex: number | undefined = $state();

	const tabs = Object.keys(Day).filter((el) => !isNaN(Number(el)));
	let activeTab = $state(tabs[0] ?? '0');

	let scheduleMap: Map<Day, ScheduleRange[]> = $state(initializeEmptyMap());

	onMount(async () => {
		scheduleMap = mapToUI((await schedule) ?? [], staffID);
	});

	let isDialogOpen = $state(false);
	let rangeStart = $state('09:00');
	let rangeEnd = $state('17:00');

	let error = $state('');

	function confirmRange(existingIndex?: number) {
		error = '';
		const start = parseTimeString(rangeStart);
		const end = parseTimeString(rangeEnd);
		if (!start || !end) {
			error = 'Formato ora non valido';
			return;
		}
		if (toMinutes(end) <= toMinutes(start)) {
			error = "L'orario di fine deve essere successivo all'orario di inizio.";
			return;
		}

		const targetDay = Number(activeTab) as Day;
		const newRange: ScheduleRange = {
			start: new Time(start.hour, start.minute),
			end: new Time(end.hour, end.minute)
		};

		const dayRanges = scheduleMap.get(targetDay);

		if (!dayRanges) {
			return;
		}

		if (!validateRange(newRange, dayRanges)) {
			error = "L'orario inserito va in conflitto con quelli già presenti.";
			return false;
		}
		if (existingIndex !== undefined) {
			const arr = scheduleMap.get(targetDay) ?? [];
			arr[existingIndex] = newRange;
			scheduleMap.set(targetDay, arr);
		} else {
			const arr = scheduleMap.get(targetDay) ?? [];
			const merged = [...arr, newRange].sort((a, b) => {
				const aMinutes = (a.start.hour ?? 0) * 60 + (a.start.minute ?? 0);
				const bMinutes = (b.start.hour ?? 0) * 60 + (b.start.minute ?? 0);
				return aMinutes - bMinutes;
			});
			scheduleMap.set(targetDay, merged);
		}

		scheduleMap = new Map(scheduleMap);

		isDialogOpen = false;
		rangeStart = '09:00';
		rangeEnd = '17:00';
	}

	let deleting = $state(false);
	const submitDelete: SubmitFunction = () => {
		deleting = true;
		return async ({ result }) => {
			if (result.type === 'success') {
				await invalidateAll();
				scheduleMap = mapToUI((await schedule) ?? [], staffID);
				toast.success('Range eliminato!');
			} else if (result.type === 'failure') {
				toast.error('Impossibile eliminare il range.');
			}
			deleting = false;
			isDialogOpen = false;
			deleteDialog = false;
		};
	};

	let updating = $state(false);
	const submitFunction: SubmitFunction = ({ formData }) => {
		updating = true;
		formData.append('data', JSON.stringify(mapToDB(scheduleMap)));

		return async ({ result }) => {
			if (result.type === 'success') {
				await invalidateAll();
				scheduleMap = mapToUI((await schedule) ?? [], staffID);
				toast.success('Orario aggiornato!');
			} else {
				toast.success("Impossibile aggiornare l'orario.");
			}

			updating = false;
		};
	};

	let deleteDialog = $state(false);
	let idRangeToDelete: number | null = $state(null);
</script>

<Tabs.Root bind:value={activeTab} class="mb-5" orientation="vertical">
	{#if isMobile.current}
		<Select.Root type="single" bind:value={activeTab}>
			<Select.Trigger>{getWeekDay(Number(activeTab))}</Select.Trigger>
			<Select.Content>
				{#each tabs as t}
					<Select.Item value={t}>{getWeekDay(Number(t))}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	{:else}
		<Tabs.List>
			{#each tabs as t}
				<Tabs.Trigger value={t}>{getWeekDay(Number(t))}</Tabs.Trigger>
			{/each}
		</Tabs.List>
	{/if}
	{#each tabs as t}
		<Tabs.Content value={t}>
			<Card.Root>
				<Card.Header>
					<Card.Title>{getWeekDay(Number(t))}</Card.Title>
				</Card.Header>

				<Card.Content class="grid gap-4">
					{#await schedule}
						<Skeleton class="h-[55px]" />
						<Skeleton class="h-[55px]" />
					{:then _}
						{#if scheduleMap}
							{#each scheduleMap.get(Number(t) as Day) ?? [] as s, idx}
								<div
									role="listitem"
									class="flex h-[55px] items-center justify-between gap-4 rounded-md border px-4 py-2 shadow-sm"
								>
									<div class="flex items-center gap-3">
										<div class="flex flex-col">
											<span class="text-sm text-muted-foreground">
												{formatTime(s.start)} — {formatTime(s.end)}
											</span>
										</div>
									</div>

									{#if !s.id}
										<Badge variant="outline" class="border-yellow-400">
											Da salvare
										</Badge>
									{/if}
									<div class="flex gap-2">
										<div class="flex flex-row gap-2 align-middle">
											<Button
												size="icon"
												variant="secondary"
												onclick={() => {
													action = 'edit';
													isDialogOpen = true;
													rangeStart = convertTimeFormat(s.start);
													rangeEnd = convertTimeFormat(s.end);
													editingIndex = idx;
												}}><Pencil /></Button
											>

											<Button
												size="icon"
												variant={s.id ? 'destructive' : 'ghost'}
												type="submit"
												onclick={() => {
													if (s.id) {
														deleteDialog = true;
														idRangeToDelete = s.id;
													} else {
														const ranges =
															scheduleMap
																.get(Number(t) as Day)
																?.filter((_, i) => idx !== i) ?? [];

														scheduleMap.set(Number(t), ranges);
														scheduleMap = new Map(scheduleMap);
													}
												}}
											>
												{#if s.id}
													<Trash />
												{:else}
													<X />
												{/if}
											</Button>
										</div>
									</div>
								</div>
							{/each}

							{#if (scheduleMap.get(Number(t) as Day) ?? []).length === 0}
								<div class="text-sm text-muted-foreground">
									Nessun orario impostato per questo giorno.
								</div>
							{/if}
						{:else}
							<!-- While scheduleMap is undefined (before onMount runs) we can show a placeholder -->
							<div class="text-sm text-muted-foreground">Caricamento...</div>
						{/if}
					{/await}
				</Card.Content>

				<Card.Footer>
					<Button
						onclick={() => {
							action = 'add';
							isDialogOpen = true;
						}}>Aggiungi orario</Button
					>
				</Card.Footer>
			</Card.Root>
		</Tabs.Content>
	{/each}
</Tabs.Root>

<form action="?/addSchedule" method="POST" use:enhance={submitFunction}>
	<Button type="submit" class="w-full">
		{#if !updating}
			<Save />
			Salva Orario
		{:else}
			<LoaderCircle class="animate-spin" />
			Attendi
		{/if}
	</Button>
</form>

<!-- Dialog to add or change range -->
<Dialog.Root bind:open={isDialogOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>
				{#if action === 'add'}
					Aggiungi range per {getWeekDay(Number(activeTab)).toLowerCase()}
				{:else}
					Cambia range per {getWeekDay(Number(activeTab)).toLowerCase()}
				{/if}
			</Dialog.Title>
		</Dialog.Header>

		<div class="grid gap-4 py-4">
			<div class="grid grid-cols-4 items-center gap-4">
				<Label class="mb-0" for="start">Inizio</Label>
				<Input id="start" type="time" bind:value={rangeStart} class="col-span-3" />
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label class="mb-0" for="end">Fine</Label>
				<Input id="end" type="time" bind:value={rangeEnd} class="col-span-3" />
			</div>
		</div>
		<div class="grid">
			{#if error}
				<div class="text-sm text-destructive">{error}</div>
			{/if}
		</div>

		<Dialog.Footer>
			<div class="flex flex-row-reverse">
				{#if action === 'add'}
					<Button class="ml-2" onclick={() => confirmRange()}>Aggiungi</Button>
				{:else}
					<Button class="ml-2" onclick={() => confirmRange(editingIndex)}>Conferma</Button
					>
				{/if}
				<Button variant="outline" onclick={() => (isDialogOpen = false)}>Annulla</Button>
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- Dialog to delete range -->
<Dialog.Root bind:open={deleteDialog}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Conferma eliminazione di range</Dialog.Title>
			<Dialog.Description>Sei sicuro di voler eliminare questo range?</Dialog.Description>
		</Dialog.Header>

		<Dialog.Footer>
			<form
				action="?/deleteSchedule"
				method="POST"
				id="deleteform"
				use:enhance={submitDelete}
			>
				<input type="hidden" name="id" value={idRangeToDelete} />
				<div class="flex flex-row-reverse">
					<Button class="ml-2" variant="destructive" type="submit" disabled={deleting}>
						{#if !deleting}
							Conferma
						{:else}
							<LoaderCircle class="animate-spin" />
							Attendi
						{/if}
					</Button>
					<Button
						disabled={deleting}
						variant="outline"
						onclick={() => {
							deleteDialog = false;
							idRangeToDelete = null;
						}}>Annulla</Button
					>
				</div>
			</form>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
