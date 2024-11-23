<script>
	import Modeswitch from '$components/modeswitch.svelte';
	import Switchlang from './switchlang.svelte';
</script>

<div class="z-99 sticky top-0">
	<div
		class="border-bottom mb-6 flex justify-between bg-background-alt bg-opacity-45 p-2 px-8 align-middle shadow-md backdrop-blur-lg"
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
