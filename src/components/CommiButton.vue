<script setup lang="ts">
defineProps<{
  text: string;
  title?: string;
}>();
</script>

<template>
  <button 
    class="px-4 py-2 rounded-lg bg-primary text-white shadow-sm hover:bg-primary-dark 
           transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 
           focus:ring-primary"
    :title="title"
  >
    {{ text }}
  </button>
</template>

<style scoped>
button {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
</style>