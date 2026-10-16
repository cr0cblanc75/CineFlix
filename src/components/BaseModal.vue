<script setup>
import { onBeforeUnmount, onMounted } from 'vue'

const emit = defineEmits(['close'])
const onKey = (e) => e.key === 'Escape' && emit('close')

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
    <Teleport to="body">
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" @click.self="emit('close')">
            <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" role="dialog" aria-modal="true">
                <slot />
            </div>
        </div>
    </Teleport>
</template>