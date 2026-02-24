<script lang="ts">
  import { goto } from "$app/navigation";
  import Duration from "$lib/components/app/duration.svelte";
  import ConfirmDialog from "$lib/components/app/newreservation/confirm.svelte";
  import DatePicker from "$lib/components/app/newreservation/datepicker.svelte";
  import KindPicker from "$lib/components/app/newreservation/kindpicker.svelte";
  import SlotPicker from "$lib/components/app/newreservation/slotpicker.svelte";
  import StaffPicker from "$lib/components/app/newreservation/staffpicker.svelte";
  import PageHeader from "$lib/components/app/pageheader.svelte";
  import { Button } from "$lib/components/ui/button/index";
  import * as Card from "$lib/components/ui/card";
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import { getSlots } from "$lib/modules/get-slots";
  import { cn, formatCurrency, formatDate, formatTime, minutesToTime } from "$lib/utils";
  import type { BookingResult } from "@domain";
  import { parseDate, parseTime } from "@internationalized/date";
  import { bookSchema } from "@schema";
  import { untrack } from "svelte";
  import { toast } from "svelte-sonner";
  import { slide } from "svelte/transition";
  import { superForm } from "sveltekit-superforms";
  import { zod4Client as zodClient } from "sveltekit-superforms/adapters";

  import { mapToUI } from "../(protected)/(admin)/dashboard/calendar/ranges";
  import type { PageData } from "./$types";

  const { data }: { data: PageData } = $props();

  const sForm = superForm(
    untrack(() => data.form),
    {
      validators: zodClient(bookSchema),
      validationMethod: "onblur",
      onResult: ({ result }) => {
        if (result.type === "success" && result.data) {
          const res = result.data as BookingResult;
          if (res?.pending) {
            goto(`/book/pending/${res.id}`);
          } else if (res) {
            goto(`/book/confirm/${res.id}`);
          }
        } else if (result.type === "failure") {
          if (result.status === 500 && result.data?.email) {
            toast.error("Non è stato possibile inviare l'email.", {
              description: "Riprova più tardi",
              duration: 4000,
            });
          } else if (result.status === 409) {
            toast.error("Prenotazione non disponibile", {
              description: `Purtroppo la data da te scelta non è più disponibile. Scegli un'altra data`,
              duration: 4000,
            });
          } else if (result.status === 500) {
            toast.error("Impossibile effettuare la prenotazione.", {
              description: "Riprova più tardi",
              duration: 4000,
            });
          }
        }
        isDialogOpen = false;
      },
    },
  );

  const { form: formData, enhance, submitting, validateForm } = sForm;

  const stepClass = "space-y-4 border-l-2 py-1 pl-4 transition-colors";

  const schedule = $derived(mapToUI(data.schedule ?? [], $formData.staff));

  let isDialogOpen = $state(false);
  let selectedKindIds = $state<string[]>($formData.kinds ?? []);
  const selectedStaff = $derived(data.staff.find((staff) => staff.id === $formData.staff));
  const selectedKinds = $derived(data.kinds.filter((el) => selectedKindIds.includes(el.id)));
  const selectedKindDuration = $derived(
    selectedKinds.reduce((duration, current) => duration + current.duration, 0),
  );
  const selectedKindPrice = $derived(
    selectedKinds.reduce((price, current) => price + current.price, 0),
  );
  const canBook = $derived(
    Boolean($formData.staff && $formData.kinds.length > 0 && $formData.date && $formData.hour),
  );
  const isAnonymousInfoComplete = $derived(
    Boolean($formData.name?.trim() && $formData.email?.trim()),
  );
  const isStaffCustomerNameComplete = $derived(Boolean($formData.name?.trim()));

  const availableSlots = $derived.by(() => {
    if (!$formData.date || !$formData.staff) return [];
    return getSlots(
      parseDate($formData.date),
      data.currentReservations
        .filter((entry) => entry.staff.id === $formData.staff)
        .filter((el) => el.date === $formData.date)
        .filter((entry) => entry.hour)
        .map((entry) => ({
          date: parseDate(entry.date),
          start: parseTime(entry.hour),
          duration: minutesToTime(entry.kinds.reduce((total, kind) => total + kind.duration, 0)),
        })),
      schedule,
      selectedKindDuration > 0 ? minutesToTime(selectedKindDuration) : undefined,
    );
  });

  const book = async () => {
    const result = await validateForm({ update: true });
    if (result.valid) isDialogOpen = true;
  };

  function getStepClass(completed: boolean) {
    return cn(stepClass, completed ? "border-success" : "border-border/70");
  }

  function clearDateAndHour() {
    $formData.date = "";
    $formData.hour = "";
  }

  function handleStaffChange(value: string) {
    if ($formData.staff === value) return;

    $formData.staff = value;
    selectedKindIds = [];
    $formData.kinds = [];
    clearDateAndHour();
  }

  function handleKindChange(value: string[]) {
    if (selectedKindIds.join("|") === value.join("|")) return;

    selectedKindIds = value;
    $formData.kinds = value;
    clearDateAndHour();
  }

  function getDateLabel(date: string) {
    if (!date) return "Da selezionare";

    try {
      return formatDate(date);
    } catch {
      return date;
    }
  }

  function getHourLabel(hour: string) {
    if (!hour) return "Da selezionare";

    try {
      return formatTime(hour);
    } catch {
      return hour;
    }
  }
</script>

<svelte:head>
  <meta
    name="description"
    content="Prenota subito il tuo appuntamento da Emi Hair Club di Emiliano Lo Russo. Scegli tra i vari servizi, seleziona data e orario disponibili e ricevi conferma istantanea. Prenota online in pochi click."
  />
</svelte:head>

<div class="mx-auto w-full max-w-5xl">
  <PageHeader title="Prenotazione" />

  <ConfirmDialog bind:isOpen={isDialogOpen} loading={$submitting} />

  <div class="grid w-full gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
    <form method="POST" use:enhance id="reservationForm" class="min-w-0">
      <input type="hidden" name="who" value={$formData.who} />
      <div class="flex flex-col gap-7">
        {#if !data.user}
          <section class={getStepClass(isAnonymousInfoComplete)}>
            <div class="grid gap-4 md:grid-cols-2">
              <Form.Field form={sForm} name="name">
                <Form.Control>
                  {#snippet children({ props })}
                    <Form.Label>Nome*</Form.Label>
                    <Input
                      {...props}
                      bind:value={$formData.name}
                      placeholder="Mario Rossi"
                      autocomplete="name"
                    />
                  {/snippet}
                </Form.Control>
                <Form.FieldErrors />
              </Form.Field>

              <Form.Field form={sForm} name="email">
                <Form.Control>
                  {#snippet children({ props })}
                    <Form.Label>Email*</Form.Label>
                    <Input
                      {...props}
                      bind:value={$formData.email}
                      placeholder="mariorossi@esempio.com"
                      autocomplete="email"
                    />
                  {/snippet}
                </Form.Control>
                <Form.FieldErrors />
              </Form.Field>

              <Form.Field form={sForm} name="phone">
                <Form.Control>
                  {#snippet children({ props })}
                    <Form.Label>Telefono</Form.Label>
                    <Input
                      {...props}
                      bind:value={$formData.phone}
                      placeholder="+39 333 444 55 66"
                      autocomplete="mobile tel"
                    />
                  {/snippet}
                </Form.Control>
              </Form.Field>
            </div>
          </section>
        {/if}

        {#if data.user?.role === "staff"}
          <section class={getStepClass(isStaffCustomerNameComplete)}>
            <Form.Field form={sForm} name="name">
              <Form.Control>
                {#snippet children({ props })}
                  <Form.Label>Nome</Form.Label>
                  <Input {...props} bind:value={$formData.name} placeholder="Mario Rossi" />
                {/snippet}
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
          </section>
        {/if}

        <section class={getStepClass(Boolean($formData.staff))}>
          <h2 class="typo-subheading">Staff</h2>
          <Form.Field form={sForm} name="staff">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label class="sr-only">Staff</Form.Label>
                <input type="hidden" name={props.name} value={$formData.staff} />
                <StaffPicker
                  staff={data.staff}
                  value={$formData.staff}
                  onStaffChange={handleStaffChange}
                />
              {/snippet}
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
        </section>

        {#if $formData.staff}
          <section
            class={getStepClass($formData.kinds.length > 0)}
            transition:slide={{ duration: 180 }}
          >
            <h2 class="typo-subheading">Servizi</h2>
            <Form.Field form={sForm} name="kinds">
              <Form.Control>
                <Form.Label class="sr-only">Servizi</Form.Label>
                {#each $formData.kinds as kindID (kindID)}
                  <input type="hidden" name="kinds" value={kindID} />
                {/each}
                {#key $formData.staff}
                  <KindPicker
                    kinds={data.kinds?.filter((el) => el.staffID === $formData.staff) ?? []}
                    value={selectedKindIds}
                    onKindChange={handleKindChange}
                  />
                {/key}
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
          </section>
        {/if}

        {#if $formData.staff && $formData.kinds.length > 0}
          <section
            class={getStepClass(Boolean($formData.date))}
            transition:slide={{ duration: 180 }}
          >
            <h2 class="typo-subheading">Data</h2>
            <Form.Field form={sForm} name="date">
              <Form.Control>
                {#snippet children({ props })}
                  <input type="hidden" name={props.name} value={$formData.date} />
                  <DatePicker
                    bind:value={$formData.date}
                    shutdown={data.shutdown}
                    staffID={$formData.staff}
                    onHourReset={() => ($formData.hour = "")}
                  />
                {/snippet}
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
          </section>
        {/if}

        {#if $formData.date}
          <section
            class={getStepClass(Boolean($formData.hour))}
            transition:slide={{ duration: 180 }}
          >
            <h2 class="typo-subheading">Orario</h2>
            <Form.Field form={sForm} name="hour">
              <Form.Control>
                {#snippet children({ props })}
                  <input type="hidden" name={props.name} value={$formData.hour} />
                  <SlotPicker {availableSlots} date={$formData.date} bind:value={$formData.hour} />
                {/snippet}
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
          </section>
        {/if}
      </div>
    </form>

    <aside class="lg:sticky lg:top-28">
      <Card.Root>
        <Card.Header>
          <Card.Title>Riepilogo</Card.Title>
          <Card.Description>Controlla i dettagli della prenotazione.</Card.Description>
        </Card.Header>

        <Card.Content class="space-y-5">
          <dl
            class="divide-y divide-border overflow-hidden rounded-xl border border-border bg-gray-2"
          >
            <div class="flex items-center justify-between gap-4 px-4 py-3">
              <dt class="text-muted-foreground typo-body-sm">Staff</dt>
              <dd class="min-w-0 truncate text-right typo-label text-muted-foreground">
                {selectedStaff?.name ?? "Da selezionare"}
              </dd>
            </div>
          </dl>

          <section class="space-y-2.5" aria-labelledby="services-summary-title">
            <div class="flex items-center justify-between gap-3 px-1">
              <p id="services-summary-title" class="text-muted-foreground typo-overline">Servizi</p>
              {#if selectedKinds.length > 0}
                <span class="rounded-full bg-gray-3 px-2 py-0.5 typo-caption text-muted-foreground">
                  {selectedKinds.length}
                </span>
              {/if}
            </div>

            <div class="overflow-hidden rounded-xl border border-border bg-card">
              {#if selectedKinds.length > 0}
                <ol class="divide-y divide-border">
                  {#each selectedKinds as kind, index (kind.id)}
                    <li class="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 p-3.5">
                      <span
                        class="flex size-6 shrink-0 items-center justify-center rounded-lg bg-gray-3 typo-caption text-muted-foreground"
                        aria-hidden="true"
                      >
                        {index + 1}
                      </span>
                      <div class="min-w-0">
                        <p class="wrap-break-word typo-label leading-5">{kind.name}</p>
                        <div
                          class="mt-1.5 flex items-center justify-between gap-3 text-muted-foreground typo-caption"
                        >
                          <span><Duration amount={kind.duration} /></span>
                          <span class="shrink-0 tabular-nums text-foreground">
                            {formatCurrency(String(kind.price))}
                          </span>
                        </div>
                      </div>
                    </li>
                  {/each}
                </ol>
              {:else}
                <div class="px-4 py-5 text-center">
                  <p class="typo-label text-muted-foreground">Nessun servizio selezionato</p>
                </div>
              {/if}
            </div>
          </section>

          <dl
            class="divide-y divide-border overflow-hidden rounded-xl border border-border bg-gray-2"
          >
            <div class="flex items-center justify-between gap-4 px-4 py-3">
              <dt class="text-muted-foreground typo-body-sm">Data</dt>
              <dd class="text-right typo-label text-muted-foreground">
                {getDateLabel($formData.date)}
              </dd>
            </div>
            <div class="flex items-center justify-between gap-4 px-4 py-3">
              <dt class="text-muted-foreground typo-body-sm">Orario</dt>
              <dd class="text-right typo-label text-muted-foreground">
                {getHourLabel($formData.hour)}
              </dd>
            </div>
            <div class="flex items-center justify-between gap-4 px-4 py-3">
              <dt class="text-muted-foreground typo-body-sm">Durata</dt>
              <dd class="text-right typo-label text-muted-foreground">
                {#if selectedKindDuration > 0}
                  <Duration amount={selectedKindDuration} />
                {:else}
                  Da selezionare
                {/if}
              </dd>
            </div>
          </dl>

          <div
            class="flex items-center justify-between gap-4 rounded-xl bg-foreground px-4 py-3.5 text-background"
          >
            <div>
              <p class="typo-subtitle">Totale</p>
              <p class="mt-0.5 typo-caption text-background/70">
                {selectedKinds.length === 1 ? "1 servizio" : `${selectedKinds.length} servizi`}
              </p>
            </div>
            <p class="typo-heading tabular-nums">
              {formatCurrency(String(selectedKindPrice))}
            </p>
          </div>

          <Button
            type="button"
            onclick={book}
            disabled={!canBook}
            aria-label="Conferma prenotazione"
            class="w-full"
          >
            Prenota
          </Button>
        </Card.Content>
      </Card.Root>
    </aside>
  </div>
</div>
