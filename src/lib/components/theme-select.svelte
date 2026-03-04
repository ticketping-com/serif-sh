<script lang="ts">
  import { Select } from 'bits-ui'
  import CaretDoubleDown from 'phosphor-svelte/lib/CaretDoubleDown'
  import CaretDoubleUp from 'phosphor-svelte/lib/CaretDoubleUp'
  import CaretDown from 'phosphor-svelte/lib/CaretDown'
  import Check from 'phosphor-svelte/lib/Check'
  import VercelLogoMark from './icons/vercel-logo-mark.svelte'
  import PeerlistLogoMark from './icons/peerlist-logo-mark.svelte'

  type ThemeOption = {
    value: string
    label: string
    preview: string
    disabled?: boolean
  }

  type Props = {
    value: string
    label?: string
    options: ThemeOption[]
    handleValueChange?: (value: string) => void
  }

  let { value = $bindable(), label = '', options, handleValueChange }: Props = $props()

  const selectedOption = $derived(options.find((item) => item.value === value))
  const selectedPreview = $derived(selectedOption?.preview || '')

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
  <Select.Root type="single" bind:value={value as never} {onValueChange}>
    <Select.Trigger class="select-trigger" aria-label="Select theme">
      {#if value === 'vercel'}
        <VercelLogoMark size={16} />
      {:else if value === 'peerlist'}
        <PeerlistLogoMark size={16} />
      {:else}
        <span
          class="flex items-center justify-center w-4 h-4 rounded-[50%] border border-[#A8A8A8] "
          style="background: {selectedPreview};"
        ></span>
      {/if}
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
                  {#if option.value === 'vercel'}
                    <VercelLogoMark size={16} />
                  {:else if option.value === 'peerlist'}
                    <PeerlistLogoMark size={16} />
                  {:else}
                    <span
                      class="flex items-center justify-center w-4 h-4 rounded-[50%] border border-[#EAEAEA]"
                      style="background: {option.preview};"
                    ></span>
                  {/if}
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
