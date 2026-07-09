<script lang="ts">
  export let positionClass = "left-1/2 -translate-x-1/2";
</script>

<div class="absolute top-full mt-2 px-2 py-1 bg-parchment-100 text-ink-900 text-xs font-semibold rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-custom {positionClass}">
  <slot />
</div>
