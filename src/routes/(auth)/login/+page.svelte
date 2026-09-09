<script lang="ts">
  import AuthLayout from "$lib/components/app/authlayout.svelte";
  import Passwordinput from "$lib/components/app/passwordinput.svelte";
  import { CircleAlert, CircleCheckBig, LoaderCircle } from "$lib/components/icons/index";
  import * as Alert from "$lib/components/ui/alert";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input/index";
  import { loginSchema, recoverPasswordSchema } from "@schema";
  import { untrack } from "svelte";
  import { toast } from "svelte-sonner";
  import { superForm } from "sveltekit-superforms";
  import { zod4Client as zodClient } from "sveltekit-superforms/adapters";

  import type { PageData } from "./$types";

  const { data }: { data: PageData } = $props();

  const sForm = superForm(
    untrack(() => data.form),
    {
      id: "login-form",
      validators: zodClient(loginSchema),
      onResult({ result }) {
        if (
          result.type === "failure" &&
          result.data &&
          "message" in result.data &&
          typeof result.data.message === "string"
        ) {
          toast.error("Accesso non riuscito", {
            description: result.data.message,
          });
        }
      },
    },
  );
  const { form: formData, enhance, delayed } = sForm;

  const recoverSForm = superForm(
    untrack(() => data.recoverForm),
    {
      id: "recover-password-form",
      validators: zodClient(recoverPasswordSchema),
    },
  );
  const {
    form: recoverFormData,
    enhance: recoverEnhance,
    delayed: recoverDelayed,
    message: recoverMessage,
  } = recoverSForm;

  let open = $state(false);
</script>

<svelte:head>
  <meta name="description" content="Accedi al tuo account." />
</svelte:head>

<AuthLayout title="Bentornato" subtitle="Accedi per continuare.">
  <form method="post" use:enhance action="?/login" class="space-y-4">
    <Form.Field form={sForm} name="email">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Email</Form.Label>
          <Input {...props} bind:value={$formData.email} />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
    <Form.Field form={sForm} name="password">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Password</Form.Label>
          <Passwordinput {...props} bind:value={$formData.password}></Passwordinput>
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <div class="mt-10 flex justify-between">
      <Button href="/signup" aria-label="Sign up" variant="outline">Registrati</Button>
      <Button onclick={() => (open = true)} variant="outline" aria-label="Recover password">
        Recupera password
      </Button>

      <Button disabled={$delayed} type="submit">
        {#if !$delayed}
          Sign In
        {:else}
          <LoaderCircle class="animate-spin" />
          Attendi
        {/if}
      </Button>
    </div>
  </form>
</AuthLayout>

<Dialog.Root {open} onOpenChange={(v) => (open = v)}>
  <Dialog.Content class="sm:max-w-106.25">
    <Dialog.Header>
      <Dialog.Title>Recupera password</Dialog.Title>
      {#if !$recoverMessage?.success}
        <Dialog.Description>
          Per recuperare la password inserisci la mail del tuo account. Ti verrà inviata una mail.
        </Dialog.Description>
      {/if}
    </Dialog.Header>

    {#if $recoverMessage?.success}
      <div class="flex flex-col gap-4">
        <Alert.Root variant="default" class="flex items-center gap-2">
          <CircleCheckBig class="size-4" />
          <Alert.Description>{$recoverMessage.text}</Alert.Description>
        </Alert.Root>
        <Button onclick={() => (open = false)}>Chiudi</Button>
      </div>
    {:else}
      <form method="post" action="?/recoverPassword" use:recoverEnhance class="space-y-4">
        {#if $recoverMessage?.success === false}
          <Alert.Root variant="destructive" class="flex items-center gap-2">
            <CircleAlert class="size-4" />
            <Alert.Description>{$recoverMessage.text}</Alert.Description>
          </Alert.Root>
        {/if}

        <Form.Field form={recoverSForm} name="email">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Email</Form.Label>
              <Input
                {...props}
                bind:value={$recoverFormData.email}
                placeholder="mariorossi@example.com"
              />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Dialog.Footer class="flex flex-col gap-2 md:flex-row">
          <Button type="button" variant="outline" onclick={() => (open = false)}>Annulla</Button>
          <Button type="submit" disabled={$recoverDelayed}>
            {#if $recoverDelayed}
              <LoaderCircle class="animate-spin" />
              Attendi
            {:else}
              Invia
            {/if}
          </Button>
        </Dialog.Footer>
      </form>
    {/if}
  </Dialog.Content>
</Dialog.Root>
