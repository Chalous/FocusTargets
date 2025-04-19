<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const toggle = () => {
  emit('update:modelValue', !props.modelValue);
};
</script>

<template>
  <div 
    class="toggle-switch cursor-pointer"
    :class="{ 'checked': modelValue }"
    @click="toggle"
  >
    <div class="toggle-circle"></div>
  </div>
</template>

<style scoped>
.toggle-switch {
  position: relative;
  width: 24px;
  height: 14px;
  background-color: #e5e7eb;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.toggle-switch.checked {
  background-color: #10B981;
}

.toggle-circle {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 10px;
  height: 10px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.3s;
}

.toggle-switch.checked .toggle-circle {
  transform: translateX(10px);
}
</style>