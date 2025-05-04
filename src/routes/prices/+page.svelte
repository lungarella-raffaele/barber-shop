<script lang="ts">
	import { Info } from '$lib/components/icons/index';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Table from '$lib/components/ui/table';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();

	const { services } = data;
</script>

<meta
	name="description"
	content="Scopri il listino prezzi completo di Emi Hair Club di Emiliano Lo Russo. Tagli di capelli, servizi barba, trattamenti e pacchetti personalizzati a prezzi competitivi. Qualità professionale e trasparenza nei costi."
/>

<h1 class="title">Listino Prezzi</h1>
<div class="flex flex-col items-center">
	<Table.Root>
		<Table.Caption>Il tempo è indicativo, e potrebbe variare.</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head>Taglio</Table.Head>
				<Table.Head>Tempo</Table.Head>
				<Table.Head>Costo</Table.Head>
				<Table.Head>Info</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each services as service (service.id)}
				<Table.Row>
					<Table.Cell>{service.name}</Table.Cell>
					<Table.Cell
						>{service.duration}
						<span class="text-muted-foreground">min</span></Table.Cell
					>
					<Table.Cell
						>{service.price}
						<span class="text-muted-foreground">&euro;</span>
					</Table.Cell>

					<Table.Cell>
						<Popover.Root>
							<Popover.Trigger
								aria-label="Show service description"
								class={buttonVariants({ variant: 'icon' })}
							>
								<Info />
							</Popover.Trigger>

							<Popover.Content>{service.description}</Popover.Content>
						</Popover.Root>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
