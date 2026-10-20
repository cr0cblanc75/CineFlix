<script setup>
import { computed, onMounted, ref } from 'vue'
import BaseModal from './BaseModal.vue'

const props = defineProps({
    title: { type: String, default: 'Create Library' },
    subtitle: { type: String, default: 'Set up a new library to organize your films.' },
    confirmLabel: { type: String, default: 'Create Library' },
    initialName: { type: String, default: '' },
    initialDescription: { type: String, default: '' },
})
const emit = defineEmits(['close', 'submit'])

const name = ref(props.initialName)
const description = ref(props.initialDescription)
const input = ref(null)
const valid = computed(() => name.value.trim().length > 0)

onMounted(() => input.value?.focus())

function submit() {
    if (!valid.value) return
    emit('submit', { name: name.value.trim(), description: description.value.trim() })
}
</script>

<template>
    <BaseModal @close="emit('close')">
        <form @submit.prevent="submit">
            <h2 class="text-lg font-bold">{{ title }}</h2>
            <p class="mt-1 text-xs text-slate-500">{{ subtitle }}</p>

            <label class="mt-5 block text-xs font-medium text-slate-700">
                Library Name
                <input ref="input" v-model="name" maxlength="40" placeholder="e.g. Sci-Fi Vault" class="mt-1.5 w-full rounded-lg border border-[var(--color-slate-300)] px-3 py-2 text-sm font-normal focus:border-brand focus:outline-none" />
            </label>

            <label class="mt-4 block text-xs font-medium text-slate-700">
                Description
                <textarea v-model="description" rows="3" maxlength="140" placeholder="Add a short description..." class="mt-1.5 w-full resize-none rounded-lg border border-[var(--color-slate-300)] px-3 py-2 text-sm font-normal focus:border-brand focus:outline-none"></textarea>
            </label>

            <div class="mt-6 flex items-center justify-end gap-3">
                <button type="button" class="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:cursor-pointer" @click="emit('close')">
                    Cancel
                </button>
                <button type="submit" :disabled="!valid" class="rounded-lg bg-[var(--color-brand)] px-4 py-2 text-xs font-semibold text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:brightness-110 hover:cursor-pointer">
                    {{ confirmLabel }}
                </button>
            </div>
        </form>
    </BaseModal>
</template>