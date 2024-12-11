<script lang="ts">
	import '../app.css';
	import * as Menubar from '$lib/components/ui/menubar/index.js';
	import { ModeWatcher } from 'mode-watcher';
	import Modeswitcher from '$lib/components/app/modeswitcher.svelte';

	let { children } = $props();
</script>

<ModeWatcher />
<Menubar.Root>
	<Menubar.Menu>
		<Menubar.Trigger>File</Menubar.Trigger>
		<Menubar.Content>
			<Menubar.Item>
				New Tab
				<Menubar.Shortcut>⌘T</Menubar.Shortcut>
			</Menubar.Item>
			<Menubar.Item>New Window</Menubar.Item>
			<Menubar.Separator />
			<Menubar.Item>Share</Menubar.Item>
			<Menubar.Separator />
			<Menubar.Item>Print</Menubar.Item>
		</Menubar.Content>
	</Menubar.Menu>

	<Modeswitcher />
</Menubar.Root>

{@render children()}
