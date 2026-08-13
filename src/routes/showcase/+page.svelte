<script lang="ts">
  import Pageheader from "$lib/components/app/pageheader.svelte";
  import { Target } from "$lib/components/icons/index.js";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import * as Alert from "$lib/components/ui/alert/index.js";
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Calendar } from "$lib/components/ui/calendar/";
  import RangeCalendar from "$lib/components/ui/calendar/range-calendar.svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import * as InputGroup from "$lib/components/ui/input-group/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Progress } from "$lib/components/ui/progress/index.js";
  import * as RadioGroup from "$lib/components/ui/radio-group/index.js";
  import * as ScrollArea from "$lib/components/ui/scroll-area/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import { Skeleton } from "$lib/components/ui/skeleton/index.js";
  import { Slider } from "$lib/components/ui/slider/index.js";
  import { Switch } from "$lib/components/ui/switch/index.js";
  import * as Table from "$lib/components/ui/table/index.js";
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
  import { Toggle } from "$lib/components/ui/toggle/index.js";
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
  import { CalendarDate } from "@internationalized/date";
  import type { DateRange } from "bits-ui";

  import type { PageData } from "./$types";

  type DebugRoute = {
    label: string;
    href: string | null;
    route: string;
    group: "Public" | "Auth" | "Protected" | "Admin" | "Legacy";
    category:
      | "Core pages"
      | "Authentication"
      | "Reservation lifecycle"
      | "User lifecycle"
      | "Password recovery"
      | "Protected user area"
      | "Admin area"
      | "Legacy redirects";
    ephemeral?: boolean;
    state?: string;
    note?: string;
  };

  type RouteSection = {
    title: string;
    description: string;
    routes: DebugRoute[];
  };

  const { data }: { data: PageData & { routeSections: RouteSection[] } } = $props();

  let checkboxItems = $state(["toolbar"]);
  let notifications = $state(true);
  let preview = $state(false);
  let partialSync = $state(true);
  let density = $state("comfortable");
  let selectedService = $state("haircut");
  let selectedStaff = $state("emi");
  let selectedLongList = $state("item-3");
  let blockedDate = $state(new CalendarDate(2026, 6, 24));
  let bookingRange: DateRange = $state({
    start: new CalendarDate(2026, 6, 20),
    end: new CalendarDate(2026, 6, 23),
  });

  let email = $state("hello@example.com");
  let search = $state("");
  let notes = $state("This is a textarea value.");
  let termsAccepted = $state(true);
  let marketingAccepted = $state(false);
  let mixedCheckbox = $state(true);
  let contactPreference = $state("email");
  let username = $state("raff");
  let website = $state("barber-shop");
  let message = $state("Need a haircut tomorrow morning.");
  let onlineBooking = $state(true);
  let darkModePreview = $state(false);
  let reminderLeadTime = $state(30);
  let volumeRange = $state([20, 80]);
  let formatToggle = $state(false);
  let selectedFormats = $state(["bold"]);
  let selectedTab = $state("overview");
</script>

<svelte:head>
  <title>Showcase</title>
</svelte:head>

<main class="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
  <Pageheader title="Showcase" />

  <section class="bg-card text-card-foreground rounded-lg border border-border p-4">
    <div class="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <div>
        <h2 class="typo-subtitle">Routes</h2>
        <p class="text-muted-foreground typo-caption">
          Canonical flows and compatibility redirects.
        </p>
      </div>
      <p class="text-muted-foreground typo-caption">
        Missing data? Run <code class="rounded bg-muted px-1 py-0.5 font-mono">pnpm db:seed</code>
      </p>
    </div>

    <div class="space-y-5">
      {#each data.routeSections as section (section.title)}
        <div class="space-y-2">
          <div>
            <h3 class="typo-subtitle">{section.title}</h3>
            <p class="text-muted-foreground typo-caption">{section.description}</p>
          </div>

          <div class="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {#each section.routes as route (route.route + route.label)}
              <article
                class="flex min-h-28 flex-col rounded-lg border border-border bg-background p-3"
              >
                <div class="flex min-w-0 items-start justify-between gap-2">
                  <div class="min-w-0">
                    <h4 class="truncate typo-label">{route.label}</h4>
                    <p class="text-muted-foreground truncate font-mono typo-caption">
                      {route.route}
                    </p>
                  </div>
                  {#if route.href}
                    <Button href={route.href} size="xs" variant="outline">Open</Button>
                  {:else}
                    <Button size="xs" variant="outline" disabled>Missing</Button>
                  {/if}
                </div>

                {#if route.state || route.note}
                  <p class="text-muted-foreground mt-2 line-clamp-2 typo-caption">
                    {route.state ?? route.note}
                  </p>
                {/if}

                <div class="mt-auto flex flex-wrap gap-1 pt-2">
                  <Badge variant="secondary" class="h-4 px-1.5 typo-caption">{route.group}</Badge>
                  {#if route.ephemeral}
                    <Badge variant="outline" class="h-4 px-1.5 typo-caption">Fake</Badge>
                  {/if}
                </div>
              </article>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </section>

  <section class="bg-card text-card-foreground rounded-lg border border-border p-4">
    <div class="mb-4">
      <h2 class="typo-subheading">Button</h2>
      <p class="text-muted-foreground typo-body-sm">All button variants, sizes, and states.</p>
    </div>

    <div class="flex flex-col gap-5">
      <div>
        <h3 class="text-muted-foreground mb-3 typo-label">Variants</h3>
        <div class="flex flex-wrap items-center gap-3">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>

      <div>
        <h3 class="text-muted-foreground mb-3 typo-label">Sizes</h3>
        <div class="flex flex-col gap-6">
          <div class="flex flex-wrap items-center gap-3">
            <Button size="xs">Extra small</Button>
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <Button size="icon-xs" aria-label="Extra small icon">XS</Button>
            <Button size="icon-sm" aria-label="Small icon">SM</Button>
            <Button size="icon" aria-label="Default icon">MD</Button>
            <Button size="icon-lg" aria-label="Large icon">LG</Button>

            <Button size="icon" variant="icon" aria-label="Large icon">
              <Target />
            </Button>
          </div>
        </div>
      </div>

      <div>
        <h3 class="text-muted-foreground mb-3 typo-label">States</h3>
        <div class="flex flex-wrap items-center gap-3">
          <Button disabled>Disabled</Button>
          <Button variant="outline" disabled>Disabled outline</Button>
          <Button href="/showcase">Anchor button</Button>
          <Button href="/showcase" disabled>Disabled anchor</Button>
        </div>
      </div>
    </div>
  </section>

  <section class="bg-card text-card-foreground rounded-lg border border-border p-4">
    <div class="mb-4">
      <h2 class="typo-subheading">Dropdown Menu</h2>
      <p class="text-muted-foreground typo-body-sm">
        Root, trigger, content, labels, groups, items, shortcuts, separators, checkbox items, radio
        items, and submenus.
      </p>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          {#snippet child({ props })}
            <Button {...props} variant="outline">Open dropdown</Button>
          {/snippet}
        </DropdownMenu.Trigger>

        <DropdownMenu.Content class="w-64">
          <DropdownMenu.Label>Account</DropdownMenu.Label>
          <DropdownMenu.Group>
            <DropdownMenu.GroupHeading>Actions</DropdownMenu.GroupHeading>
            <DropdownMenu.Item>
              Profile
              <DropdownMenu.Shortcut>⇧⌘P</DropdownMenu.Shortcut>
            </DropdownMenu.Item>
            <DropdownMenu.Item inset>Billing</DropdownMenu.Item>
            <DropdownMenu.Item disabled>Disabled item</DropdownMenu.Item>
            <DropdownMenu.Item variant="destructive">Delete account</DropdownMenu.Item>
          </DropdownMenu.Group>

          <DropdownMenu.Separator />

          <DropdownMenu.CheckboxGroup bind:value={checkboxItems}>
            <DropdownMenu.GroupHeading>Visibility</DropdownMenu.GroupHeading>
            <DropdownMenu.CheckboxItem value="toolbar">Toolbar</DropdownMenu.CheckboxItem>
            <DropdownMenu.CheckboxItem bind:checked={notifications}>
              Notifications
            </DropdownMenu.CheckboxItem>
            <DropdownMenu.CheckboxItem bind:checked={preview}
              >Preview panel</DropdownMenu.CheckboxItem
            >
            <DropdownMenu.CheckboxItem bind:indeterminate={partialSync}>
              Partially synced
            </DropdownMenu.CheckboxItem>
          </DropdownMenu.CheckboxGroup>

          <DropdownMenu.Separator />

          <DropdownMenu.RadioGroup bind:value={density}>
            <DropdownMenu.GroupHeading>Density</DropdownMenu.GroupHeading>
            <DropdownMenu.RadioItem value="compact">Compact</DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="comfortable">Comfortable</DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="spacious">Spacious</DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>

          <DropdownMenu.Separator />

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>More options</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent class="w-48">
              <DropdownMenu.Item>Invite user</DropdownMenu.Item>
              <DropdownMenu.Item>Export data</DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item variant="destructive">Remove workspace</DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          {#snippet child({ props })}
            <Button {...props} variant="ghost">Ghost trigger</Button>
          {/snippet}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          <DropdownMenu.Item>First item</DropdownMenu.Item>
          <DropdownMenu.Item>Second item</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  </section>

  <section class="bg-card text-card-foreground rounded-lg border border-border p-4">
    <div class="mb-4">
      <h2 class="typo-subheading">Select</h2>
      <p class="text-muted-foreground typo-body-sm">
        Single select with trigger, content, labels, groups, headings, separator, disabled item,
        invalid state, small size, and scroll controls.
      </p>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <div class="space-y-2">
        <Label for="showcase-select-service">Service</Label>
        <Select.Root type="single" bind:value={selectedService}>
          <Select.Trigger id="showcase-select-service" class="w-full">
            <span data-slot="select-value">
              {#if selectedService === "haircut"}
                Haircut
              {:else if selectedService === "beard"}
                Beard trim
              {:else if selectedService === "combo"}
                Haircut + beard
              {:else if selectedService === "shave"}
                Traditional shave
              {/if}
            </span>
          </Select.Trigger>
          <Select.Content>
            <Select.Label>Services</Select.Label>
            <Select.Group>
              <Select.GroupHeading>Popular</Select.GroupHeading>
              <Select.Item value="haircut" label="Haircut" />
              <Select.Item value="beard" label="Beard trim" />
              <Select.Item value="combo" label="Haircut + beard" />
            </Select.Group>
            <Select.Separator />
            <Select.Group>
              <Select.GroupHeading>Other</Select.GroupHeading>
              <Select.Item value="shave" label="Traditional shave" />
              <Select.Item value="color" label="Color treatment" disabled />
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </div>

      <div class="space-y-2">
        <Label for="showcase-select-staff">Staff</Label>
        <Select.Root type="single" bind:value={selectedStaff}>
          <Select.Trigger id="showcase-select-staff" size="sm" class="w-full">
            <span data-slot="select-value">
              {#if selectedStaff === "emi"}
                Emi
              {:else if selectedStaff === "alex"}
                Alex
              {:else if selectedStaff === "sam"}
                Sam
              {/if}
            </span>
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="emi" label="Emi" />
            <Select.Item value="alex" label="Alex" />
            <Select.Item value="sam" label="Sam" />
          </Select.Content>
        </Select.Root>
      </div>

      <div class="space-y-2">
        <Label for="showcase-select-invalid">Invalid</Label>
        <Select.Root type="single" value="">
          <Select.Trigger id="showcase-select-invalid" aria-invalid="true" class="w-full">
            <span data-slot="select-value" class="text-muted-foreground">Choose an option</span>
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="one" label="Option one" />
            <Select.Item value="two" label="Option two" />
          </Select.Content>
        </Select.Root>
      </div>

      <div class="space-y-2">
        <Label for="showcase-select-disabled">Disabled</Label>
        <Select.Root type="single" value="disabled" disabled>
          <Select.Trigger id="showcase-select-disabled" class="w-full">
            <span data-slot="select-value">Disabled select</span>
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="disabled" label="Disabled select" />
          </Select.Content>
        </Select.Root>
      </div>

      <div class="space-y-2 md:col-span-2">
        <Label for="showcase-select-scroll">Scrollable content</Label>
        <Select.Root type="single" bind:value={selectedLongList}>
          <Select.Trigger id="showcase-select-scroll" class="w-full md:w-80">
            <span data-slot="select-value">{selectedLongList}</span>
          </Select.Trigger>
          <Select.Content class="max-h-52">
            <Select.Group>
              <Select.GroupHeading>Long list</Select.GroupHeading>
              {#each Array.from({ length: 20 }, (_, index) => `item-${index + 1}`) as item}
                <Select.Item value={item} label={item} />
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </div>
    </div>
  </section>

  <section class="bg-card text-card-foreground rounded-lg border border-border p-4">
    <div class="mb-4">
      <h2 class="typo-subheading">Calendars</h2>
      <p class="text-muted-foreground typo-body-sm">
        Product-style date selection for reservations and shop closure periods.
      </p>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <RangeCalendar bind:value={bookingRange} locale="it-IT" />

      <Calendar
        type="single"
        bind:value={blockedDate}
        captionLayout="dropdown"
        years={Array.from({ length: 7 }, (_, index) => 2024 + index)}
        locale="it-IT"
      />
    </div>
  </section>

  <section class="bg-card text-card-foreground rounded-lg border border-border p-4">
    <div class="mb-4">
      <h2 class="typo-subheading">Inputs</h2>
      <p class="text-muted-foreground typo-body-sm">
        Text inputs, common input types, invalid state, disabled state, and file input.
      </p>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <div class="space-y-2">
        <Label for="showcase-email">Email</Label>
        <Input id="showcase-email" type="email" bind:value={email} placeholder="name@example.com" />
      </div>

      <div class="space-y-2">
        <Label for="showcase-search">Search</Label>
        <Input
          id="showcase-search"
          type="search"
          bind:value={search}
          placeholder="Search services"
        />
      </div>

      <div class="space-y-2">
        <Label for="showcase-password">Password</Label>
        <Input id="showcase-password" type="password" value="password" />
      </div>

      <div class="space-y-2">
        <Label for="showcase-number">Number</Label>
        <Input id="showcase-number" type="number" value="3" min="1" max="10" />
      </div>

      <div class="space-y-2">
        <Label for="showcase-invalid-input">Invalid</Label>
        <Input
          id="showcase-invalid-input"
          value="not-an-email"
          aria-invalid="true"
          placeholder="Invalid value"
        />
      </div>

      <div class="space-y-2">
        <Label for="showcase-disabled-input">Disabled</Label>
        <Input id="showcase-disabled-input" value="Disabled value" disabled />
      </div>

      <div class="space-y-2 md:col-span-2">
        <Label for="showcase-file">File</Label>
        <Input id="showcase-file" type="file" />
      </div>
    </div>
  </section>

  <section class="bg-card text-card-foreground rounded-lg border border-border p-4">
    <div class="mb-4">
      <h2 class="typo-subheading">Textarea</h2>
      <p class="text-muted-foreground typo-body-sm">
        Default, invalid, and disabled textarea states.
      </p>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <div class="space-y-2">
        <Label for="showcase-notes">Notes</Label>
        <Textarea id="showcase-notes" bind:value={notes} placeholder="Write a note" />
      </div>

      <div class="space-y-2">
        <Label for="showcase-invalid-textarea">Invalid</Label>
        <Textarea
          id="showcase-invalid-textarea"
          value="Too short"
          aria-invalid="true"
          placeholder="Invalid message"
        />
      </div>

      <div class="space-y-2 md:col-span-2">
        <Label for="showcase-disabled-textarea">Disabled</Label>
        <Textarea id="showcase-disabled-textarea" value="Disabled textarea" disabled />
      </div>
    </div>
  </section>

  <section class="bg-card text-card-foreground rounded-lg border border-border p-4">
    <div class="mb-4">
      <h2 class="typo-subheading">Checkbox</h2>
      <p class="text-muted-foreground typo-body-sm">
        Checked, unchecked, indeterminate, invalid, and disabled states.
      </p>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <div class="flex items-center gap-3">
        <Checkbox id="showcase-checkbox-checked" bind:checked={termsAccepted} />
        <Label for="showcase-checkbox-checked">Checked</Label>
      </div>

      <div class="flex items-center gap-3">
        <Checkbox id="showcase-checkbox-unchecked" bind:checked={marketingAccepted} />
        <Label for="showcase-checkbox-unchecked">Unchecked</Label>
      </div>

      <div class="flex items-center gap-3">
        <Checkbox id="showcase-checkbox-indeterminate" bind:indeterminate={mixedCheckbox} />
        <Label for="showcase-checkbox-indeterminate">Indeterminate</Label>
      </div>

      <div class="flex items-center gap-3">
        <Checkbox id="showcase-checkbox-invalid" aria-invalid="true" />
        <Label for="showcase-checkbox-invalid">Invalid</Label>
      </div>

      <div class="flex items-center gap-3">
        <Checkbox id="showcase-checkbox-disabled" checked disabled />
        <Label for="showcase-checkbox-disabled">Disabled checked</Label>
      </div>
    </div>
  </section>

  <section class="bg-card text-card-foreground rounded-lg border border-border p-4">
    <div class="mb-4">
      <h2 class="typo-subheading">Radio Group</h2>
      <p class="text-muted-foreground typo-body-sm">
        Radio group selection, invalid state, and disabled item.
      </p>
    </div>

    <RadioGroup.Root bind:value={contactPreference} class="max-w-md">
      <div class="flex items-center gap-3">
        <RadioGroup.Item id="showcase-radio-email" value="email" />
        <Label for="showcase-radio-email">Email</Label>
      </div>

      <div class="flex items-center gap-3">
        <RadioGroup.Item id="showcase-radio-phone" value="phone" />
        <Label for="showcase-radio-phone">Phone</Label>
      </div>

      <div class="flex items-center gap-3">
        <RadioGroup.Item id="showcase-radio-invalid" value="sms" aria-invalid="true" />
        <Label for="showcase-radio-invalid">SMS invalid state</Label>
      </div>

      <div class="flex items-center gap-3">
        <RadioGroup.Item id="showcase-radio-disabled" value="fax" disabled />
        <Label for="showcase-radio-disabled">Disabled</Label>
      </div>
    </RadioGroup.Root>
  </section>

  <section class="bg-card text-card-foreground rounded-lg border border-border p-4">
    <div class="mb-4">
      <h2 class="typo-subheading">Input Group</h2>
      <p class="text-muted-foreground typo-body-sm">
        Inline addons, buttons, text labels, block addons, and textarea groups.
      </p>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <div class="space-y-2">
        <Label for="showcase-input-group-username">Username</Label>
        <InputGroup.Root>
          <InputGroup.Addon>@</InputGroup.Addon>
          <InputGroup.Input id="showcase-input-group-username" bind:value={username} />
        </InputGroup.Root>
      </div>

      <div class="space-y-2">
        <Label for="showcase-input-group-website">Website</Label>
        <InputGroup.Root>
          <InputGroup.Addon>https://</InputGroup.Addon>
          <InputGroup.Input id="showcase-input-group-website" bind:value={website} />
          <InputGroup.Addon align="inline-end">.com</InputGroup.Addon>
        </InputGroup.Root>
      </div>

      <div class="space-y-2">
        <Label for="showcase-input-group-search">Search with button</Label>
        <InputGroup.Root>
          <InputGroup.Input id="showcase-input-group-search" placeholder="Search clients" />
          <InputGroup.Addon align="inline-end">
            <InputGroup.Button>Search</InputGroup.Button>
          </InputGroup.Addon>
        </InputGroup.Root>
      </div>

      <div class="space-y-2">
        <Label for="showcase-input-group-price">Price</Label>
        <InputGroup.Root>
          <InputGroup.Addon>€</InputGroup.Addon>
          <InputGroup.Input id="showcase-input-group-price" type="number" value="25" />
          <InputGroup.Addon align="inline-end">
            <InputGroup.Text>EUR</InputGroup.Text>
          </InputGroup.Addon>
        </InputGroup.Root>
      </div>

      <div class="space-y-2 md:col-span-2">
        <Label for="showcase-input-group-block">Block addon</Label>
        <InputGroup.Root>
          <InputGroup.Addon align="block-start" class="border-border border-b">
            Message to the barber
          </InputGroup.Addon>
          <InputGroup.Textarea id="showcase-input-group-block" bind:value={message} />
          <InputGroup.Addon align="block-end" class="border-border border-t">
            <InputGroup.Text>{message.length} characters</InputGroup.Text>
          </InputGroup.Addon>
        </InputGroup.Root>
      </div>
    </div>
  </section>

  <section class="bg-card text-card-foreground rounded-lg border border-border p-4">
    <div class="mb-4">
      <h2 class="typo-subheading">Switch</h2>
      <p class="text-muted-foreground typo-body-sm">
        Binary settings in checked, unchecked, small, invalid, and disabled states.
      </p>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <div class="flex items-center justify-between rounded-lg border border-border p-4">
        <div class="space-y-0.5">
          <Label for="showcase-switch-booking">Online booking</Label>
          <p class="text-muted-foreground typo-body-sm">Allow customers to book appointments.</p>
        </div>
        <Switch id="showcase-switch-booking" bind:checked={onlineBooking} />
      </div>

      <div class="flex items-center justify-between rounded-lg border border-border p-4">
        <div class="space-y-0.5">
          <Label for="showcase-switch-invalid">Invalid setting</Label>
          <p class="text-muted-foreground typo-body-sm">Shows validation styling.</p>
        </div>
        <Switch id="showcase-switch-invalid" aria-invalid="true" bind:checked={darkModePreview} />
      </div>

      <div class="flex items-center justify-between rounded-lg border border-border p-4 opacity-80">
        <div class="space-y-0.5">
          <Label for="showcase-switch-disabled">Disabled switch</Label>
          <p class="text-muted-foreground typo-body-sm">Unavailable configuration.</p>
        </div>
        <Switch id="showcase-switch-disabled" checked disabled />
      </div>
    </div>
  </section>

  <section class="bg-card text-card-foreground rounded-lg border border-border p-4">
    <div class="mb-4">
      <h2 class="typo-subheading">Dialogs</h2>
      <p class="text-muted-foreground typo-body-sm">
        Modal surfaces for edits, confirmations, popovers, and tooltips.
      </p>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <Dialog.Root>
        <Dialog.Trigger>
          {#snippet child({ props })}
            <Button {...props}>Open dialog</Button>
          {/snippet}
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Edit appointment</Dialog.Title>
            <Dialog.Description>
              Update the appointment details before sending the customer a confirmation.
            </Dialog.Description>
          </Dialog.Header>
          <div class="grid gap-4">
            <div class="space-y-2">
              <Label for="showcase-dialog-customer">Customer</Label>
              <Input id="showcase-dialog-customer" value="Marco Rossi" />
            </div>
            <div class="space-y-2">
              <Label for="showcase-dialog-service">Service</Label>
              <Input id="showcase-dialog-service" value="Haircut + beard" />
            </div>
          </div>
          <Dialog.Footer>
            <Dialog.Close>
              {#snippet child({ props })}
                <Button {...props} variant="outline">Cancel</Button>
              {/snippet}
            </Dialog.Close>
            <Dialog.Close>
              {#snippet child({ props })}
                <Button {...props}>Save changes</Button>
              {/snippet}
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>

      <AlertDialog.Root>
        <AlertDialog.Trigger>
          {#snippet child({ props })}
            <Button {...props} variant="destructive">Open alert dialog</Button>
          {/snippet}
        </AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Header>
            <AlertDialog.Title>Cancel this booking?</AlertDialog.Title>
            <AlertDialog.Description>
              This will remove the appointment from the schedule and notify the customer.
            </AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <AlertDialog.Cancel>Keep booking</AlertDialog.Cancel>
            <AlertDialog.Action>Cancel booking</AlertDialog.Action>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>

      <Sheet.Root>
        <Sheet.Trigger>
          {#snippet child({ props })}
            <Button {...props} variant="outline">Open right sheet</Button>
          {/snippet}
        </Sheet.Trigger>
        <Sheet.Content side="right">
          <Sheet.Header>
            <Sheet.Title>Appointment details</Sheet.Title>
            <Sheet.Description>
              A drawer for secondary flows, compact navigation, or contextual details.
            </Sheet.Description>
          </Sheet.Header>

          <Sheet.Body class="space-y-4 typo-body-sm">
            <div class="rounded-lg border border-border p-4">
              <p class="typo-label">Marco Rossi</p>
              <p class="text-muted-foreground mt-1">Haircut + beard · Tomorrow at 10:30</p>
            </div>
            <div class="space-y-2">
              <Label for="showcase-sheet-note">Internal note</Label>
              <Textarea id="showcase-sheet-note" value="Customer prefers a low fade." />
            </div>
          </Sheet.Body>

          <Sheet.Footer>
            <Sheet.Close>
              {#snippet child({ props })}
                <Button {...props} variant="outline">Close</Button>
              {/snippet}
            </Sheet.Close>
            <Sheet.Close>
              {#snippet child({ props })}
                <Button {...props}>Save note</Button>
              {/snippet}
            </Sheet.Close>
          </Sheet.Footer>
        </Sheet.Content>
      </Sheet.Root>

      <Popover.Root>
        <Popover.Trigger>
          {#snippet child({ props })}
            <Button {...props} variant="outline">Open popover</Button>
          {/snippet}
        </Popover.Trigger>
        <Popover.Content class="w-80">
          <Popover.Header>
            <Popover.Title>Quick note</Popover.Title>
            <Popover.Description>Add context without leaving the page.</Popover.Description>
          </Popover.Header>
          <Textarea value="Customer prefers a low fade." />
          <div class="flex justify-end">
            <Popover.Close>
              {#snippet child({ props })}
                <Button {...props} size="sm">Done</Button>
              {/snippet}
            </Popover.Close>
          </div>
        </Popover.Content>
      </Popover.Root>

      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger>
            {#snippet child({ props })}
              <Button {...props} variant="ghost">Hover for tooltip</Button>
            {/snippet}
          </Tooltip.Trigger>
          <Tooltip.Content>Tooltips explain compact actions.</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  </section>

  <section class="bg-card text-card-foreground rounded-lg border border-border p-4">
    <div class="mb-4">
      <h2 class="typo-subheading">Tabs, toggles, slider, and progress</h2>
      <p class="text-muted-foreground typo-body-sm">
        Interactive controls for switching views, formatting, ranges, and completion.
      </p>
    </div>

    <div class="grid gap-5 lg:grid-cols-2">
      <Tabs.Root bind:value={selectedTab}>
        <Tabs.List class="bg-muted">
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
          <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content
          value="overview"
          class="mt-4 rounded-lg border border-border p-4 typo-body-sm"
        >
          Today has 12 bookings and 3 walk-ins.
        </Tabs.Content>
        <Tabs.Content
          value="activity"
          class="mt-4 rounded-lg border border-border p-4 typo-body-sm"
        >
          Latest activity: Alex confirmed a beard trim.
        </Tabs.Content>
        <Tabs.Content
          value="settings"
          class="mt-4 rounded-lg border border-border p-4 typo-body-sm"
        >
          Configure reminders, deposits, and cancellation windows.
        </Tabs.Content>
      </Tabs.Root>

      <div class="space-y-6">
        <div class="flex flex-wrap items-center gap-3">
          <Toggle bind:pressed={formatToggle} variant="outline">Single toggle</Toggle>
          <ToggleGroup.Root type="multiple" bind:value={selectedFormats} variant="outline">
            <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
            <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
            <ToggleGroup.Item value="underline">Underline</ToggleGroup.Item>
          </ToggleGroup.Root>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between typo-body-sm">
            <Label>Reminder lead time</Label>
            <span class="text-muted-foreground">{reminderLeadTime} minutes</span>
          </div>
          <Slider type="single" bind:value={reminderLeadTime} min={0} max={120} step={5} />
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between typo-body-sm">
            <Label>Range slider</Label>
            <span class="text-muted-foreground">{volumeRange[0]}–{volumeRange[1]}</span>
          </div>
          <Slider type="multiple" bind:value={volumeRange} min={0} max={100} step={5} />
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between typo-body-sm">
            <Label>Profile completion</Label>
            <span class="text-muted-foreground">68%</span>
          </div>
          <Progress value={68} />
        </div>
      </div>
    </div>
  </section>

  <section class="bg-card text-card-foreground rounded-lg border border-border p-4">
    <div class="mb-4">
      <h2 class="typo-subheading">Content primitives</h2>
      <p class="text-muted-foreground typo-body-sm">
        Badges, alerts, cards, avatars, separators, scroll areas, and loading skeletons.
      </p>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <div class="space-y-4">
        <div class="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>

        <Alert.Root>
          <Alert.Title>NewScheduleRow synced</Alert.Title>
          <Alert.Description>Appointments are up to date across all devices.</Alert.Description>
          <Alert.Action>Review</Alert.Action>
        </Alert.Root>

        <Alert.Root variant="destructive">
          <Alert.Title>Payment failed</Alert.Title>
          <Alert.Description>Ask the customer to update their payment method.</Alert.Description>
        </Alert.Root>
      </div>

      <Card.Root>
        <Card.Header>
          <Card.Title>Next appointment</Card.Title>
          <Card.Description>Today at 14:30 with Emi.</Card.Description>
          <Card.Action><Badge variant="secondary">Confirmed</Badge></Card.Action>
        </Card.Header>
        <Card.Content class="space-y-4">
          <div class="flex items-center gap-3">
            <Avatar.Root>
              <Avatar.Fallback>MR</Avatar.Fallback>
            </Avatar.Root>
            <div>
              <p class="typo-label">Marco Rossi</p>
              <p class="text-muted-foreground typo-body-sm">Haircut + beard</p>
            </div>
          </div>
          <Separator />
          <Avatar.Group>
            <Avatar.Root><Avatar.Fallback>EM</Avatar.Fallback></Avatar.Root>
            <Avatar.Root><Avatar.Fallback>AL</Avatar.Fallback></Avatar.Root>
            <Avatar.Root><Avatar.Fallback>SA</Avatar.Fallback></Avatar.Root>
            <Avatar.GroupCount>+4</Avatar.GroupCount>
          </Avatar.Group>
        </Card.Content>
        <Card.Footer>
          <Button size="sm">Open appointment</Button>
          <Button size="sm" variant="outline">Message</Button>
        </Card.Footer>
      </Card.Root>

      <div class="space-y-3 lg:col-span-2">
        <h3 class="text-muted-foreground typo-label">Scroll area</h3>
        <ScrollArea.Root class="h-40 rounded-lg border border-border">
          <div class="space-y-2 p-4">
            {#each Array.from({ length: 12 }, (_, index) => index + 1) as item}
              <div class="flex items-center justify-between typo-body-sm">
                <span>Booking request #{item}</span>
                <Badge variant="outline">Pending</Badge>
              </div>
              {#if item !== 12}<Separator />{/if}
            {/each}
          </div>
          <ScrollArea.Scrollbar orientation="vertical" />
        </ScrollArea.Root>
      </div>

      <div class="space-y-3 lg:col-span-2">
        <h3 class="text-muted-foreground typo-label">Skeleton</h3>
        <div class="flex items-center gap-4 rounded-lg border border-border p-4">
          <Skeleton class="size-12 rounded-full" />
          <div class="flex-1 space-y-2">
            <Skeleton class="h-4 w-48" />
            <Skeleton class="h-4 w-72 max-w-full" />
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="bg-card text-card-foreground rounded-lg border border-border p-4">
    <div class="mb-4">
      <h2 class="typo-subheading">Table</h2>
      <p class="text-muted-foreground typo-body-sm">
        Simple tabular data before reaching for the full data table component.
      </p>
    </div>

    <Table.Root>
      <Table.Caption>Upcoming appointments for the day.</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head>Customer</Table.Head>
          <Table.Head>Service</Table.Head>
          <Table.Head>Time</Table.Head>
          <Table.Head class="text-right">Price</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell class="typo-label">Marco Rossi</Table.Cell>
          <Table.Cell>Haircut + beard</Table.Cell>
          <Table.Cell>14:30</Table.Cell>
          <Table.Cell class="text-right">€35</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell class="typo-label">Giulia Bianchi</Table.Cell>
          <Table.Cell>Traditional shave</Table.Cell>
          <Table.Cell>15:15</Table.Cell>
          <Table.Cell class="text-right">€22</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell class="typo-label">Luca Verdi</Table.Cell>
          <Table.Cell>Color treatment</Table.Cell>
          <Table.Cell>16:00</Table.Cell>
          <Table.Cell class="text-right">€48</Table.Cell>
        </Table.Row>
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.Cell colspan={3}>Total</Table.Cell>
          <Table.Cell class="text-right">€105</Table.Cell>
        </Table.Row>
      </Table.Footer>
    </Table.Root>
  </section>
</main>
