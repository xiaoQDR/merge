<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Fit, Layout, Rive } from '@rive-app/canvas'

export interface RiveLoadInfo {
  artboard: string
  stateMachines: string[]
  animations: string[]
}

const props = withDefaults(
  defineProps<{
    src: string
    artboard?: string
    stateMachine?: string
    autoBind?: boolean
    fit?: Fit
  }>(),
  {
    autoBind: true,
    fit: Fit.Contain,
  },
)

const emit = defineEmits<{
  load: [info: RiveLoadInfo]
  error: [error: unknown]
  stateChange: [states: string[]]
}>()

const canvas = ref<HTMLCanvasElement | null>(null)
const ready = ref(false)
let rive: Rive | null = null
let resizeObserver: ResizeObserver | null = null

function resize() {
  rive?.resizeDrawingSurfaceToCanvas()
}

function destroy() {
  resizeObserver?.disconnect()
  resizeObserver = null
  rive?.cleanup()
  rive = null
  ready.value = false
}

function create() {
  if (!canvas.value) return
  destroy()

  rive = new Rive({
    src: props.src,
    canvas: canvas.value,
    autoplay: true,
    autoBind: props.autoBind,
    artboard: props.artboard,
    stateMachines: props.stateMachine,
    layout: new Layout({ fit: props.fit }),
    onLoad: () => {
      ready.value = true
      resize()

      const info: RiveLoadInfo = {
        artboard: rive?.activeArtboard ?? '',
        stateMachines: [...(rive?.stateMachineNames ?? [])],
        animations: [...(rive?.animationNames ?? [])],
      }

      if (props.stateMachine && !info.stateMachines.includes(props.stateMachine)) {
        console.warn(
          `[RiveCanvas] State machine "${props.stateMachine}" was not found in ${props.src}. Available: ${info.stateMachines.join(', ') || 'none'}`,
        )
      }

      emit('load', info)
    },
    onLoadError: (error) => {
      ready.value = false
      emit('error', error)
    },
    onStateChange: (event) => {
      const states = Array.isArray(event.data)
        ? event.data.filter((item): item is string => typeof item === 'string')
        : []
      emit('stateChange', states)
    },
  })

  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas.value)
}

function fireTrigger(name: string) {
  if (!rive || !props.stateMachine) return false
  const input = rive.stateMachineInputs(props.stateMachine)?.find((item) => item.name === name)
  if (!input || typeof input.fire !== 'function') return false
  input.fire()
  return true
}

function setBoolean(name: string, value: boolean) {
  if (!rive || !props.stateMachine) return false
  const input = rive.stateMachineInputs(props.stateMachine)?.find((item) => item.name === name)
  if (!input || typeof input.value !== 'boolean') return false
  input.value = value
  return true
}

function setNumber(name: string, value: number) {
  if (!rive || !props.stateMachine) return false
  const input = rive.stateMachineInputs(props.stateMachine)?.find((item) => item.name === name)
  if (!input || typeof input.value !== 'number') return false
  input.value = value
  return true
}

defineExpose({ fireTrigger, setBoolean, setNumber, resize })

onMounted(create)
onBeforeUnmount(destroy)
watch(() => [props.src, props.artboard, props.stateMachine, props.fit], create)
</script>

<template>
  <div class="rive-host">
    <div class="rive-fallback"><slot /></div>
    <canvas ref="canvas" class="rive-canvas" :class="{ 'is-ready': ready }" />
  </div>
</template>

<style scoped>
.rive-host {
  position: relative;
  width: 100%;
  height: 100%;
}

.rive-fallback,
.rive-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.rive-canvas {
  opacity: 0;
  pointer-events: auto;
  transition: opacity 160ms ease;
}

.rive-canvas.is-ready {
  opacity: 1;
}
</style>
