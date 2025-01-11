<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Separator } from '$lib/components/ui/separator/index';
	import type { User } from '$lib/server/db/schema';

	let { user }: { user: User } = $props();
</script>

<Separator />
<Label>Nome</Label>
{@render Info(user.firstName)}

<Label>Cognome</Label>
{@render Info(user.lastName)}

<Separator />

<Label>Email</Label>
{@render Info(user.email)}

<form method="post" action="?/logout" use:enhance>
	<Button variant="destructive" type="submit">Log out</Button>
</form>

{#snippet Info(str: string | null)}
	<span class="text-sm text-muted-foreground">
		{#if str}
			{str}
		{:else}
			Not inserted
		{/if}
	</span>
{/snippet}
