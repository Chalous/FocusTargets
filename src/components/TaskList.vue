<script setup lang="ts">
import { ref, watch } from 'vue';
import TaskItem from './TaskItem.vue';
import CommiButton from './CommiButton.vue';
import type { Task } from '../types/task';
import { TaskService } from '../services/api/taskService';

// 定义props
const props = defineProps<{
  selectedDate: Date;
}>();

// 状态
const tasks = ref<Task[]>([]);
const isLoading = ref(false);

// 初始加载和日期变化时加载任务
const loadTasks = async () => {
  isLoading.value = true;
  try {
    tasks.value = await TaskService.fetchTasksForDate(props.selectedDate);
  } catch (error) {
    console.error('Failed to load tasks:', error);
  } finally {
    isLoading.value = false;
  }
};

// 监听日期变化
watch(() => props.selectedDate, () => {
  loadTasks();
}, { immediate: true });

// 更新任务
const updateTask = async (updatedTask: Task) => {
  try {
    const result = await TaskService.updateTask(updatedTask);
    const index = tasks.value.findIndex(t => t.id === result.id);
    if (index !== -1) {
      tasks.value[index] = result;
    }
  } catch (error) {
    console.error('Failed to update task:', error);
  }
};

// 删除任务
const handleDelete = async (taskId: number) => {
  try {
    const success = await TaskService.deleteTask(taskId);
    if (success) {
      const index = tasks.value.findIndex(t => t.id === taskId);
      if (index !== -1) {
        tasks.value.splice(index, 1);
      }
    }
  } catch (error) {
    console.error('Failed to delete task:', error);
  }
};

// 创建新任务
const addNewTask = async () => {
  try {
    const newTask = await TaskService.createTask({
      content: '',
      completed: false,
      subTasks: []
    });
    tasks.value.push(newTask);
  } catch (error) {
    console.error('Failed to create task:', error);
  }
};
</script>

<template>
  <div class="task-list">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-medium text-gray-800">
        {{ selectedDate.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' }) }} 任务
      </h2> 
      <div class="flex items-center gap-4">
        <CommiButton text="Commit" />
        <CommiButton text="+" title="添加任务" @click="addNewTask" />
      </div>
    </div>
    
    <div v-if="isLoading" class="flex items-center justify-center py-10">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>
    
    <div v-else-if="tasks.length === 0" class="bg-white rounded-lg p-6 text-center text-gray-500">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <p>当天没有任务</p>
      <div class="mt-4 flex justify-center">
        <CommiButton text="创建新任务" @click="addNewTask" />
      </div>
    </div>
    
    <div v-else class="space-y-2">
      <TaskItem 
        v-for="task in tasks" 
        :key="task.id" 
        :task="task"
        @update="updateTask"
        @delete="handleDelete" 
      />
    </div>
  </div>
</template>