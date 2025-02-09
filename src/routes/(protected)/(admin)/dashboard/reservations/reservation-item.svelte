<script lang="ts">
	type Props = {
		item: {
			reservation: {
				date: string;
				id: string;
				hour: string;
				name: string;
				serviceID: string;
				email: string;
			};
			service: {
				id: string;
				name: string;
				duration: number;
				price: number;
				description: string;
			};
		};
	};

	let { item }: Props = $props();
</script>

{item.reservation.name}
{item.reservation.hour}
{item.service.name}
