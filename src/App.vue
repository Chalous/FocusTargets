<script setup lang="ts">
import { ref } from 'vue';
import Calendar from './components/Calendar.vue';
import TaskList from './components/TaskList.vue';
import FocusButton from './components/FocusButton.vue';

// 当前选中日期
const selectedDate = ref(new Date());
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <h1 class="text-xl font-medium text-gray-800">FocusTarget</h1>
        <FocusButton />
      </div>
    </header>
    
    <main class="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
        <!-- 日历部分 -->
        <div class="md:col-span-4 shadow-xl rounded-lg">
          <Calendar v-model="selectedDate" />
        </div>
        
        <!-- 任务列表部分 -->
        <div class="md:col-span-8">
          <TaskList :selected-date="selectedDate" />
        </div>
      </div>
    </main>
  </div>
</template>