<script>
	import Modeswitch from '$components/modeswitch.svelte';
	import Switchlang from './switchlang.svelte';
</script>

<div class="sticky top-0 z-50">
	<div
		class="border-bottom mb-6 flex justify-between bg-background-alt p-2 px-8 align-middle shadow-md"
	>
		<div class="flex flex-row items-center">
			<h1 class="text-xl font-bold">LO RUSSO</h1>
		</div>
		<div class="flex flex-row">
			<Switchlang />
			<Modeswitch />
		</div>
	</div>
</div>
