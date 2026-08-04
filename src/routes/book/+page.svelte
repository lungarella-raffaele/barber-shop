<script lang="ts">
  import { goto } from "$app/navigation";
  import { checkShutdown } from "$lib/components/app/newreservation/check-shutdown";
  import ConfirmDialog from "$lib/components/app/newreservation/confirm.svelte";
  import DatePicker from "$lib/components/app/newreservation/datepicker.svelte";
  import KindPicker from "$lib/components/app/newreservation/kindpicker.svelte";
  import SlotPicker from "$lib/components/app/newreservation/slotpicker.svelte";
  import StaffPicker from "$lib/components/app/newreservation/staffpicker.svelte";
  import PageHeader from "$lib/components/app/pageheader.svelte";
  import { Button } from "$lib/components/ui/button/index";
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import { findFirstAvailableDate } from "$lib/modules/find-first-available-date";
  import { getSlots } from "$lib/modules/get-slots";
  import { minutesToTime } from "$lib/utils";
  import type { BookingResult } from "@domain";
  import {
    getLocalTimeZone,
    parseDate,
    parseTime,
    today,
    type CalendarDate,
  } from "@internationalized/date";
  import { bookSchema, kindsFieldSchema } from "@schema";
  import { untrack } from "svelte";
  import { toast } from "svelte-sonner";
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
      scrollToError: "off",
      onResult: ({ result }) => {
        if (result.type === "success" && result.data) {
          const res = result.data as BookingResult;
          if (res?.confirmationToken) {
            goto(`/book/confirm/${res.confirmationToken}`);
          } else if (res) {
            goto(`/${res.id}`);
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

  const { form: formData, errors, enhance, submitting, validate, validateForm } = sForm;

  const stepClass = "space-y-4 py-1";

  const schedule = $derived(mapToUI(data.schedule ?? [], $formData.staff));

  let isDialogOpen = $state(false);
  let selectedKindIds = $state<string[]>($formData.kinds ?? []);
  const selectedStaff = $derived(data.staff.find((staff) => staff.id === $formData.staff));
  const selectedKinds = $derived(data.kinds.filter((el) => selectedKindIds.includes(el.id)));
  const selectedKindDuration = $derived(
    selectedKinds.reduce((duration, current) => duration + current.duration, 0),
  );

  function getAvailableSlots(date: CalendarDate) {
    if (!$formData.staff) return [];

    const dateValue = date.toString();
    return getSlots(
      date,
      data.currentReservations
        .filter((entry) => entry.staff.id === $formData.staff)
        .filter((entry) => entry.date === dateValue)
        .filter((entry) => entry.hour)
        .map((entry) => ({
          date: parseDate(entry.date),
          start: parseTime(entry.hour),
          duration: minutesToTime(entry.kinds.reduce((total, kind) => total + kind.duration, 0)),
        })),
      schedule,
      selectedKindDuration > 0 ? minutesToTime(selectedKindDuration) : undefined,
    );
  }

  const availableSlots = $derived.by(() => {
    if (!$formData.date) return [];
    return getAvailableSlots(parseDate($formData.date));
  });

  const firstAvailableDate = $derived.by(() => {
    if (!$formData.staff || selectedKindDuration <= 0) return undefined;

    return findFirstAvailableDate(today(getLocalTimeZone()), (date) => {
      if (checkShutdown(date, data.shutdown, $formData.staff)) return false;
      return getAvailableSlots(date).some((slot) => slot.available && !slot.invalid && !slot.past);
    });
  });

  const book = async () => {
    const result = await validateForm({ update: true });
    if (result.valid) isDialogOpen = true;
  };

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
    void validate("staff");
  }

  function handleKindChange(value: string[]) {
    if (selectedKindIds.join("|") === value.join("|")) return;

    selectedKindIds = value;
    $formData.kinds = value;
    clearDateAndHour();

    const result = kindsFieldSchema.safeParse(value);
    $errors.kinds = result.success
      ? undefined
      : { _errors: result.error.issues.map((issue) => issue.message) };
  }

  function handleDateChange(value: string) {
    $formData.date = value;
    void validate("date");
  }

  function handleHourChange(value: string) {
    $formData.hour = value;
    void validate("hour");
  }
</script>

<svelte:head>
  <meta
    name="description"
    content="Prenota subito il tuo appuntamento da Emi Hair Club di Emiliano Lo
    Russo. Scegli tra i vari servizi, seleziona data e orario disponibili e
    ricevi conferma istantanea. Prenota online in pochi click."
  />
</svelte:head>

<ConfirmDialog
  bind:isOpen={isDialogOpen}
  loading={$submitting}
  staff={selectedStaff}
  kinds={selectedKinds}
  date={$formData.date}
  hour={$formData.hour}
  duration={selectedKindDuration}
/>
<div class="mx-auto w-full max-w-xl">
  <PageHeader title="Prenotazione" />

  <form method="POST" use:enhance id="reservationForm" class="min-w-0">
    <input type="hidden" name="who" value={$formData.who} />

    <div class="flex flex-col gap-7">
      {#if !data.user}
        <section class={stepClass}>
          <div class="grid gap-4">
            <Form.Field form={sForm} name="name">
              <Form.Control>
                {#snippet children({ props })}
                  <Form.Label required>Nome</Form.Label>
                  <Input
                    {...props}
                    bind:value={$formData.name}
                    placeholder=""
                    autocomplete="name"
                  />
                {/snippet}
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>

            <Form.Field form={sForm} name="email">
              <Form.Control>
                {#snippet children({ props })}
                  <Form.Label required>Email</Form.Label>
                  <Input
                    {...props}
                    bind:value={$formData.email}
                    placeholder=""
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
                    placeholder=""
                    autocomplete="mobile tel"
                  />
                {/snippet}
              </Form.Control>
            </Form.Field>
          </div>
        </section>
      {/if}

      {#if data.user?.role === "staff"}
        <section class={stepClass}>
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

      <section class={stepClass}>
        <h2 class="px-2 typo-subheading">Staff</h2>
        <Form.Field form={sForm} name="staff">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label class="sr-only">Staff</Form.Label>
              <input type="hidden" name={props.name} value={$formData.staff} />
              <StaffPicker
                class="w-full"
                staff={data.staff}
                value={$formData.staff}
                onStaffChange={handleStaffChange}
              />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
      </section>

      <section class="relative {stepClass}">
        <h2 class="px-2 typo-subheading">Servizi</h2>
        <fieldset
          disabled={!$formData.staff}
          class="transition-opacity duration-300"
          class:opacity-35={!$formData.staff}
        >
          <Form.Field form={sForm} name="kinds">
            <Form.Control>
              <Form.Label class="sr-only">Servizi</Form.Label>
              {#each $formData.kinds as kindID (kindID)}
                <input type="hidden" name="kinds" value={kindID} />
              {/each}
              <KindPicker
                kinds={data.kinds?.filter((el) => el.staffID === $formData.staff) ?? []}
                value={selectedKindIds}
                onKindChange={handleKindChange}
              />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
        </fieldset>
        <div
          aria-hidden="true"
          class="absolute inset-0 z-10 rounded-2xl bg-background/35 transition-[opacity,backdrop-filter] duration-300"
          class:pointer-events-none={$formData.staff}
          class:opacity-0={$formData.staff}
          class:backdrop-blur-0={$formData.staff}
          class:backdrop-blur-[2px]={!$formData.staff}
        ></div>
      </section>

      <section class="relative {stepClass}">
        <h2 class="px-2 typo-subheading">Data</h2>
        <fieldset
          disabled={!$formData.staff || $formData.kinds.length === 0}
          class="transition-opacity duration-300"
          class:opacity-35={!$formData.staff || $formData.kinds.length === 0}
        >
          <Form.Field form={sForm} name="date">
            <Form.Control>
              {#snippet children({ props })}
                <input type="hidden" name={props.name} value={$formData.date} />
                <DatePicker
                  bind:value={$formData.date}
                  shutdown={data.shutdown}
                  staffID={$formData.staff}
                  {firstAvailableDate}
                  onHourReset={() => ($formData.hour = "")}
                  onDateChange={handleDateChange}
                />
              {/snippet}
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
        </fieldset>
        <div
          aria-hidden="true"
          class="absolute inset-0 z-10 rounded-2xl bg-background/35 transition-[opacity,backdrop-filter] duration-300"
          class:pointer-events-none={$formData.staff && $formData.kinds.length > 0}
          class:opacity-0={$formData.staff && $formData.kinds.length > 0}
          class:backdrop-blur-0={$formData.staff && $formData.kinds.length > 0}
          class:backdrop-blur-[2px]={!$formData.staff || $formData.kinds.length === 0}
        ></div>
      </section>

      <section class="relative {stepClass}">
        <h2 class="px-2 typo-subheading">Orario</h2>
        <fieldset
          disabled={!$formData.date}
          class="transition-opacity duration-300"
          class:opacity-35={!$formData.date}
        >
          <Form.Field form={sForm} name="hour">
            <Form.Control>
              {#snippet children({ props })}
                <input type="hidden" name={props.name} value={$formData.hour} />
                <SlotPicker
                  {availableSlots}
                  date={$formData.date}
                  bind:value={$formData.hour}
                  onHourChange={handleHourChange}
                />
              {/snippet}
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
        </fieldset>
        <div
          aria-hidden="true"
          class="absolute inset-0 z-10 rounded-2xl bg-background/35 transition-[opacity,backdrop-filter] duration-300"
          class:pointer-events-none={$formData.date}
          class:opacity-0={$formData.date}
          class:backdrop-blur-0={$formData.date}
          class:backdrop-blur-[2px]={!$formData.date}
        ></div>
      </section>
    </div>

    <Button
      type="button"
      onclick={book}
      aria-label="Rivedi e conferma la prenotazione"
      class="mt-8 w-full"
    >
      Prenota
    </Button>
  </form>
</div>
