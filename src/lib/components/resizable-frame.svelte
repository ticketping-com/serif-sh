<script lang="ts">
  import { frameWidth } from '$lib/stores';
  import { onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();

  const MIN_WIDTH = 400;
  const MAX_WIDTH = 920;

  let windowRef: HTMLDivElement | undefined = $state();
  let isResizing = $state(false);
  let currentHandle: 'left' | 'right' | null = $state(null);
  let startWidth = $state(0);
  let startX = $state(0);

  function handleMouseDown(event: MouseEvent, handle: 'left' | 'right') {
    if (!windowRef) return;

    currentHandle = handle;
    startWidth = windowRef.offsetWidth;
    startX = event.clientX;
    isResizing = true;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  function handleMouseMove(event: MouseEvent) {
    if (!isResizing) return;

    let newWidth: number;

    // Multiply by 2 so width increases on both sides
    if (currentHandle === 'left') {
      newWidth = startWidth - (event.clientX - startX) * 2;
    } else {
      newWidth = startWidth + (event.clientX - startX) * 2;
    }

    // Clamp to min/max
    newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth));

    frameWidth.set(newWidth);
  }

  function handleMouseUp() {
    isResizing = false;
    currentHandle = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);

    // Clear any text selection that may have happened during drag
    const selection = document.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }
  }

  function resetWidth() {
    frameWidth.set(null);
  }

  // Clean up event listeners on unmount (only in browser)
  onDestroy(() => {
    if (browser) {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
  });
</script>

<div class="resizable-frame" class:is-resizing={isResizing}>
  <!-- Left drag handle -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="drag-handle left"
    onmousedown={(e) => handleMouseDown(e, 'left')}
  ></div>

  <!-- Right drag handle -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="drag-handle right"
    onmousedown={(e) => handleMouseDown(e, 'right')}
  ></div>

  <!-- Content wrapper -->
  <div
    bind:this={windowRef}
    class="frame-content"
    style="width: {$frameWidth ? `${$frameWidth}px` : 'auto'}"
  >
    {@render children()}
  </div>

  <!-- Reset button -->
  {#if $frameWidth && !isResizing}
    <div class="reset-container">
      <button class="reset-button" onclick={resetWidth}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM5.35355 5.35355C5.15829 5.15829 4.84171 5.15829 4.64645 5.35355C4.45118 5.54882 4.45118 5.8654 4.64645 6.06066L6.58579 8L4.64645 9.93934C4.45118 10.1346 4.45118 10.4512 4.64645 10.6464C4.84171 10.8417 5.15829 10.8417 5.35355 10.6464L7.29289 8.70711L9.23223 10.6464C9.4275 10.8417 9.74408 10.8417 9.93934 10.6464C10.1346 10.4512 10.1346 10.1346 9.93934 9.93934L8 8L9.93934 6.06066C10.1346 5.8654 10.1346 5.54882 9.93934 5.35355C9.74408 5.15829 9.4275 5.15829 9.23223 5.35355L7.29289 7.29289L5.35355 5.35355Z" fill="currentColor"/>
        </svg>
        <span>Set to auto width</span>
      </button>
    </div>
  {/if}

  <!-- Ruler showing current width -->
  {#if isResizing && $frameWidth}
    <div class="ruler">
      <span>{$frameWidth} px</span>
    </div>
  {/if}
</div>

<style>
  .resizable-frame {
    position: relative;
    display: inline-block;
  }

  .resizable-frame.is-resizing {
    user-select: none;
  }

  .drag-handle {
    position: absolute;
    z-index: 10;
    top: 50%;
    width: 24px;
    height: 24px;
    cursor: col-resize;
    transform: translate(var(--translate-x), -50%);
    user-select: none;
  }

  .drag-handle::after {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 6px;
    height: 6px;
    border-radius: 3px;
    background: white;
    content: "";
    transform: translate(-50%, -50%);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  :global(html:not(.dark)) .drag-handle::after {
    background: #333;
  }

  .drag-handle.left {
    left: 0;
    --translate-x: -50%;
  }

  .drag-handle.right {
    right: 0;
    --translate-x: 50%;
  }

  .frame-content {
    max-width: 100%;
  }

  .reset-container {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    transform: translateY(100%);
    padding-top: 0.5rem;
    animation: fadeIn 200ms ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .reset-button {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4em;
    padding: 0.5em;
    color: rgba(255, 255, 255, 0.4);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 11px;
    transition: color 200ms;
  }

  .reset-button:hover {
    color: rgba(255, 255, 255, 0.7);
  }

  :global(html:not(.dark)) .reset-button {
    color: rgba(0, 0, 0, 0.4);
  }

  :global(html:not(.dark)) .reset-button:hover {
    color: rgba(0, 0, 0, 0.7);
  }

  .ruler {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    transform: translateY(calc(100% + 1rem));
    border-left: 1px solid var(--ruler-color);
    border-right: 1px solid var(--ruler-color);
    color: var(--ruler-color);
    font-size: 11px;
    text-align: center;
    --ruler-color: rgba(255, 255, 255, 0.3);
    animation: fadeIn 200ms ease-out;
  }

  :global(html:not(.dark)) .ruler {
    --ruler-color: rgba(0, 0, 0, 0.3);
  }

  .ruler > span {
    display: inline-block;
    padding: 0 1em;
    background-color: var(--bg-color, #0d0d0d);
  }

  :global(html:not(.dark)) .ruler > span {
    --bg-color: #f5f5f5;
  }

  .ruler::before {
    position: absolute;
    z-index: -1;
    top: 50%;
    left: 0;
    right: 0;
    border-top: 1px solid var(--ruler-color);
    content: "";
  }
</style>
