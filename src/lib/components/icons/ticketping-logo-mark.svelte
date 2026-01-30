<script lang="ts">
  import { getContext } from 'svelte'
  const ctx = getContext('iconCtx') ?? {}
  interface Props {
    role?: any
    ariaLabel?: string
    [key: string]: any
  }

  let { role = 'img', ariaLabel = 'logo-mark', ...rest }: Props = $props()
  const height = 32
  const width = 32
</script>

<svg
  {...rest}
  aria-label={ariaLabel}
  xmlns="http://www.w3.org/2000/svg"
  {width}
  {height}
  viewBox="0 0 100 100"
  fill="none"
  ><g clip-path="url(#a)"
    ><path
      cx="250"
      cy="250"
      r="250"
      fill="#020202"
      d="M100 50A50 50 0 0 1 50 100A50 50 0 0 1 0 50A50 50 0 0 1 100 50z"
    /><path d="M43.693 35.645h20.626l-2.697 12.693h-17.929z" fill="#fff" /><path
      d="M43.004 25.014h13.292l-11.706 50.115h-13.364z"
      fill="#fff"
    /><path
      cx="323.236"
      cy="327.412"
      r="51.765"
      fill="#4CB782"
      fill-opacity=".9"
      d="M75 65.482A10.353 10.353 0 0 1 64.647 75.835A10.353 10.353 0 0 1 54.294 65.482A10.353 10.353 0 0 1 75 65.482z"
    /></g
  ><defs><clipPath id="a"><path fill="#fff" d="M0 0h100v100H0z" /></clipPath></defs></svg
>
