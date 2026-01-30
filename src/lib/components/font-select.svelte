<script lang="ts">
  import { Select } from 'bits-ui'
  import CaretDoubleDown from 'phosphor-svelte/lib/CaretDoubleDown'
  import CaretDoubleUp from 'phosphor-svelte/lib/CaretDoubleUp'
  import CaretDown from 'phosphor-svelte/lib/CaretDown'
  import Check from 'phosphor-svelte/lib/Check'

  type FontOption = {
    value: string
    label: string
    fontFamily: string
    disabled?: boolean
  }

  type Props = {
    value: string
    label?: string
    options: FontOption[]
    handleValueChange?: (value: string) => void
  }

  let {
    value = $bindable(),
    label = '',
    options,
    handleValueChange,
  }: Props = $props()

  const selectedOption = $derived(options.find((item) => item.value === value))
  const selectedFontFamily = $derived(selectedOption?.fontFamily || '')

  function onValueChange(val: string | string[]) {
    if (typeof val === 'string' && handleValueChange) {
      handleValueChange(val)
    }
  }
</script>

<div class="flex flex-col gap-1.5">
  {#if label}
    <span class="text-[10px] font-medium uppercase tracking-wide opacity-50">{label}</span>
  {/if}
  <Select.Root type="single" bind:value={value as never} onValueChange={onValueChange}>
    <Select.Trigger class="select-trigger" aria-label="Select font">
      <span class="text-base font-medium w-6 text-center" style="font-family: {selectedFontFamily}">Aa</span>
      <CaretDown class="chevron" />
    </Select.Trigger>
    <Select.Portal>
      <Select.Content class="select-dropdown" sideOffset={4} side="top">
        <Select.ScrollUpButton class="scroll-button">
          <CaretDoubleUp class="scroll-icon" />
        </Select.ScrollUpButton>
        <Select.Viewport class="options-viewport">
          {#each options as option (option.value)}
            <Select.Item
              class="select-option"
              value={option.value}
              label={option.label}
              disabled={option.disabled ?? false}
            >
              {#snippet children({ selected })}
                <div class="option-content">
                  <span class="option-label">{option.label}</span>
                  {#if selected}
                    <Check class="check-icon" />
                  {/if}
                </div>
              {/snippet}
            </Select.Item>
          {/each}
        </Select.Viewport>
        <Select.ScrollDownButton class="scroll-button">
          <CaretDoubleDown class="scroll-icon" />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
</div>

