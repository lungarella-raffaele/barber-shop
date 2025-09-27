<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { formatTime } from '$lib/utils';
	import { onMount } from 'svelte';
	import { Check, Shield, X } from '../icons';
	import { Button } from '../ui/button';

	const { height, top, reservation } = $props();

	let ref: HTMLElement | null = $state(null);
	onMount(() => {
		if (!ref) {
			return;
		}
		const color = getColor(reservation.kindDuration);
		ref.style.top = `${top}px`;
		ref.style.height = `${height}px`;
		ref.style.backgroundColor = rgbaToString(changeOpacity(color, 0.4));
		ref.style.borderColor = rgbaToString(color);
	});

	type RGBA = {
		r: number;
		g: number;
		b: number;
		a: number;
	};

	// Helper function to create RGBA colors
	const rgba = (r: number, g: number, b: number, a: number = 1): RGBA => ({
		r,
		g,
		b,
		a
	});

	const colorPalette: RGBA[] = [
		rgba(52, 211, 153, 1), // - Emerald Green (shortest duration)
		rgba(245, 158, 11, 1), // - Amber Yellow (short-medium duration)
		rgba(255, 149, 0, 1), // - Orange (medium duration)
		rgba(239, 68, 68, 1), // - Bright Red (high duration)
		rgba(139, 92, 246, 1), // - Purple (very high duration)
		rgba(59, 130, 246, 1) // - Blue (highest duration)
	];

	const changeOpacity = (color: RGBA, newopacity: number) => {
		color.a = newopacity;
		return color;
	};

	const getColor = (duration: number): RGBA => {
		switch (duration) {
			case 20:
				return colorPalette[0];
			case 25:
				return colorPalette[1];
			case 30:
				return colorPalette[2];
			case 45:
				return colorPalette[3];
			case 60:
				return colorPalette[4];
			case 90:
				return colorPalette[5];
			default:
				return colorPalette[0];
		}
	};

	// Utility function to convert RGBA object to CSS string
	const rgbaToString = (color: RGBA): string =>
		`rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;

	let isOpen = $state(false);
	let isDialogOpen = $state(false);
</script>

<Popover.Root bind:open={isOpen}>
	<Popover.Trigger>
		{#snippet child({ props })}
			<button
				{...props}
				class="align-start absolute flex w-full flex-col items-start justify-start truncate rounded-md border-2 border-input p-3 text-start shadow-sm"
				bind:this={ref}
				onclick={() => (isOpen = !isOpen)}
			>
				<div class="text-sm">
					<b>{reservation.name}</b>
					{reservation.kindName}
				</div>

				{#if reservation.kindDuration >= 30}
					<div class="flex items-center text-xs text-secondary-foreground">
						{formatTime(reservation.hour)} - {reservation.kindDuration}min
					</div>
				{/if}

				<div class="absolute bottom-2 right-2 flex gap-2">
					{#if !reservation.pending}
						<Check
							class="rounded-lg bg-white bg-opacity-90 p-1 shadow-md"
							color="green"
							size={20}
							strokeWidth={3}
						/>
					{:else}
						<X
							class="rounded-lg bg-white bg-opacity-90 p-1 shadow-md"
							color="red"
							size={20}
							strokeWidth={3}
						/>
					{/if}

					{#if reservation.isAdmin}
						<Shield
							class="rounded-lg bg-white bg-opacity-90 p-1 shadow-md"
							color="green"
							size={20}
							strokeWidth={3}
						/>
					{/if}
				</div>
			</button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-60">
		<div class="grid gap-2">
			<b>{reservation.name}</b>
			{reservation.kindName}
			<Button href="/{reservation.id}">Vedi dettaglio</Button>
			<hr />
			<Button variant="destructive" onclick={() => (isDialogOpen = true)}>Elimina</Button>
		</div>
	</Popover.Content>
</Popover.Root>

<Dialog.Root bind:open={isDialogOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title class="text-left"
				>Sei sicuro di voler disdire l'appuntamento?</Dialog.Title
			>
			<Dialog.Description class="text-left">L'azione è irreversibile.</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<div class="flex flex-row-reverse">
				<form action="?/delete" method="post">
					<input type="hidden" name="id" value={reservation.id} />
					<Button class="ml-2" aria-label="Conferma" type="submit" variant="destructive"
						>Conferma</Button
					>
				</form>

				<Button variant="outline" onclick={() => (isDialogOpen = false)}>Chiudi</Button>
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
