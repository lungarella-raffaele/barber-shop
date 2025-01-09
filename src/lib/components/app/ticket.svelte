<script>
	let { service, date, hour, name, surname } = $props();
</script>

<div class="cardWrap">
	<div class="card cardLeft bg-foreground-muted border font-serif">
		<h1 class="mb-8 whitespace-nowrap">
			{service}
		</h1>
		<div class="name">
			<h2 class="font-bold">
				{#if name}
					{name}
				{:else}
					----
				{/if}
				{#if surname}
					{surname}
				{:else}
					----
				{/if}
			</h2>
			<span class="text-muted-foreground">nome</span>
		</div>

		<div class="d-flex">
			<div class="date">
				{#if date}
					<h2>{date}</h2>
				{:else}
					<h2>----</h2>
				{/if}

				<span class="text-muted-foreground">data</span>
			</div>

			<div class="hour">
				{#if hour}
					<h2>{hour}</h2>
				{:else}
					<h2>----</h2>
				{/if}
				<span class="text-muted-foreground">ora</span>
			</div>
		</div>
	</div>
</div>

<style>
	.cardWrap {
		display: flex;
	}

	.card {
		float: left;
		position: relative;
		padding: 1em;

		flex-grow: 1;
		height: 200px;
	}

	h1 {
		font-size: 1.3em;
		margin-top: 0;
		font-weight: bold;
	}

	.name,
	.hour,
	.date {
		text-transform: uppercase;
		font-weight: normal;
		h2 {
			font-size: 0.9em;
			margin: 0;
		}
		span {
			font-size: 0.7em;
		}
	}

	.name,
	.date {
		margin: 0.7em 0 0 0;
	}

	.hour {
		margin: 0.7em 0 0 1em;
	}

	.date,
	.hour {
		float: left;
	}
</style>
