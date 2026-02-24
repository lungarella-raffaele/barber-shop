<script lang="ts">
  import { CalendarIcon, ChevronLeft, ChevronRight } from "$lib/components/icons/index";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Calendar } from "$lib/components/ui/calendar/";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import type { Shutdown } from "@domain";
  import {
    DateFormatter,
    getDayOfWeek,
    getLocalTimeZone,
    parseDate,
    today,
    type DateValue,
  } from "@internationalized/date";

  import { checkShutdown } from "./check-shutdown";

  let {
    value = $bindable(),
    shutdown,
    staffID,
    onHourReset,
  }: {
    value: string;
    shutdown: Shutdown[];
    staffID?: string;
    onHourReset?: () => void;
  } = $props();

  const weekdayFormatter = new DateFormatter("it-IT", { weekday: "short" });
  const monthFormatter = new DateFormatter("it-IT", { month: "short" });

  function parseValue(date: string | undefined): DateValue | undefined {
    if (!date) return undefined;

    try {
      return parseDate(date);
    } catch {
      return undefined;
    }
  }

  function formatDate(date: DateValue, formatter: DateFormatter) {
    return formatter.format(date.toDate(getLocalTimeZone())).replace(".", "");
  }

  function isSameDay(a: DateValue | undefined, b: DateValue) {
    return a?.compare(b) === 0;
  }

  const initialDate = parseValue(value);

  const selectedDate = $derived(parseValue(value));
  let visibleStart = $state<DateValue>(initialDate ?? today(getLocalTimeZone()));
  let isCalendarOpen = $state(false);
  let shouldAnimateWeek = $state(false);

  const visibleDays = $derived(
    Array.from({ length: 7 }, (_, index) => visibleStart.add({ days: index })),
  );

  function isDateDisabled(date: DateValue) {
    return today(getLocalTimeZone()).compare(date) > 0 || getDayOfWeek(date, "it-IT") === 6;
  }

  function isDateUnavailable(date: DateValue): boolean {
    if (!staffID) return false;
    return checkShutdown(date, shutdown, staffID);
  }

  function canSelect(date: DateValue) {
    return !isDateDisabled(date) && !isDateUnavailable(date);
  }

  function selectDate(date: DateValue | undefined, closeCalendar = false) {
    if (!date || !canSelect(date)) return;

    const isLastVisibleDay = date.compare(visibleDays[visibleDays.length - 1]) === 0;

    value = date.toString();
    onHourReset?.();

    if (closeCalendar) {
      shouldAnimateWeek = false;
      visibleStart = date;
      isCalendarOpen = false;
    } else if (isLastVisibleDay) {
      shouldAnimateWeek = true;
      visibleStart = date;
    }
  }

  function moveVisibleDays(days: number) {
    shouldAnimateWeek = false;
    visibleStart = visibleStart.add({ days });
  }

  function slideWeekIn(_node: Element, { duration = 180 }: { duration?: number }) {
    if (!shouldAnimateWeek) return { duration: 0 };

    return {
      duration,
      css: (_t: number, u: number) => `transform: translateX(${u * 100}%);`,
    };
  }
</script>

<div>
  <h2 class="typo-subtitle">Seleziona una data</h2>
</div>

<div class="flex items-center justify-between">
  <div>
    <Popover.Root bind:open={isCalendarOpen}>
      <Popover.Trigger>
        {#snippet child({ props })}
          <Button {...props} variant="outline" size="icon">
            <CalendarIcon />
            <span class="sr-only">Apri calendario</span>
          </Button>
        {/snippet}
      </Popover.Trigger>
      <Popover.Content class="w-auto p-0" align="end">
        <Calendar
          value={selectedDate}
          {isDateDisabled}
          {isDateUnavailable}
          locale="it-IT"
          onValueChange={(date: DateValue | undefined) => selectDate(date, true)}
          initialFocus
        />
      </Popover.Content>
    </Popover.Root>
  </div>

  <div>
    <Button type="button" variant="outline" size="icon-sm" onclick={() => moveVisibleDays(-7)}>
      <ChevronLeft class="size-4" />
      <span class="sr-only">Settimana precedente</span>
    </Button>
    <Button type="button" variant="outline" size="icon-sm" onclick={() => moveVisibleDays(7)}>
      <ChevronRight class="size-4" />
      <span class="sr-only">Settimana successiva</span>
    </Button>
  </div>
</div>

<div class="selection-group overflow-hidden">
  {#key visibleStart.toString()}
    <div class="grid grid-cols-7 gap-2" in:slideWeekIn={{ duration: 180 }}>
      {#each visibleDays as date (date.toString())}
        {@render DateButton(date)}
      {/each}
    </div>
  {/key}
</div>

{#snippet DateButton(date: DateValue)}
  {@const disabled = !canSelect(date)}
  {@const selected = isSameDay(selectedDate, date)}
  <button
    type="button"
    class="selection-item min-h-18 min-w-10 flex-col items-center justify-center gap-0 rounded-xl px-2 py-3 text-center disabled:cursor-not-allowed disabled:opacity-45"
    data-state={selected ? "on" : "off"}
    {disabled}
    aria-pressed={selected}
    onclick={() => selectDate(date)}
  >
    <span class="typo-label capitalize opacity-80">
      {formatDate(date, weekdayFormatter)}
    </span>
    <span class="mt-1 typo-subtitle">{date.day}</span>
    <span class="mt-1 typo-caption capitalize opacity-70">
      {formatDate(date, monthFormatter)}
    </span>
  </button>
{/snippet}
