<script>
	import Label from './generic/label.svelte';
	import Separator from './generic/separator.svelte';
	import * as m from '$lib/paraglide/messages';

	let { name = $bindable(''), email = $bindable(''), phoneNumber = $bindable('') } = $props();
</script>

<section class="mb-8 rounded-xl border bg-background-alt p-8">
	<Separator orientation="horizontal">
		<h3 class="text-3xl font-bold">{m.bright_noisy_pony_endure()}</h3>
	</Separator>
	<Label text={m.polite_brief_lion_jest()} class="mb-8">
		<input
			type="text"
			id="name"
			name="book-name"
			bind:value={name}
			required
			class="h-10 w-[240px] rounded-md px-3 py-2"
			placeholder="Mario Rossi"
		/>
	</Label>
	<Label text="E-mail" class="mb-8">
		<input
			type="text"
			id="email"
			name="book-email"
			bind:value={email}
			required
			class="h-10 w-[240px] rounded-md px-3 py-2"
			placeholder="mariorossi@es.com"
		/>
	</Label>
	<Label text={m.home_aloof_vulture_drip()}>
		<input
			type="text"
			id="phone-number"
			name="book-phone"
			bind:value={phoneNumber}
			required
			class="h-10 w-[240px] rounded-md px-3 py-2"
			placeholder="333"
		/>
	</Label>
</section>
