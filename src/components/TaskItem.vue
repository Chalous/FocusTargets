<script setup lang="ts">
import { ref } from 'vue';
import ToggleSwitch from './ToggleSwitch3.vue';
import { Dialog, DialogPanel, TransitionRoot, DialogTitle } from '@headlessui/vue';
import type { Task, SubTask } from '../types/task';

const props = defineProps<{
  task: Task;
  level?: number;
}>();

const emit = defineEmits<{
  (e: 'update', task: Task): void;
  (e: 'delete', taskId: number): void;
}>();

const isOpen = ref(false);
const difficulties = ['简单', '中等', '困难'];
const priorityError = ref('');
const progressError = ref('');
const totalError = ref('');
const subTaskErrors = ref<Record<number, { progress?: string; total?: string }>>({});

const toggleCompleted = (value: boolean) => {
  const updatedTask = { 
    ...props.task, 
    completed: value 
  };
  emit('update', updatedTask);
};

const updateTaskContent = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  emit('update', {
    ...props.task,
    content: value
  });
};

const updateTaskType = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  emit('update', {
    ...props.task,
    taskType: value
  });
};

const updateTaskDifficulty = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value;
  emit('update', {
    ...props.task,
    difficulty: value
  });
};

const updateTaskPriority = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  
  // 验证输入是否为数字
  if (!/^\d*$/.test(value)) {
    priorityError.value = '请输入数字';
    return;
  }
  
  priorityError.value = '';
  emit('update', {
    ...props.task,
    priority: value ? parseInt(value) : undefined
  });
};

const updateTaskProgress = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  
  // 验证输入是否为数字
  if (!/^\d*$/.test(value)) {
    progressError.value = '请输入数字';
    return;
  }
  
  progressError.value = '';
  emit('update', {
    ...props.task,
    progress: value ? parseInt(value) : undefined
  });
};

const updateTaskTotal = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  
  // 验证输入是否为数字
  if (!/^\d*$/.test(value)) {
    totalError.value = '请输入数字';
    return;
  }
  
  totalError.value = '';
  emit('update', {
    ...props.task,
    total: value ? parseInt(value) : undefined
  });
};

const updateSubTask = (subTask: SubTask) => {
  const updatedSubTasks = [...props.task.subTasks];
  const index = updatedSubTasks.findIndex(t => t.id === subTask.id);
  if (index !== -1) {
    updatedSubTasks[index] = subTask;
    emit('update', {
      ...props.task,
      subTasks: updatedSubTasks
    });
  }
};

const updateSubTaskProgress = (subTask: SubTask, event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  
  // 验证输入是否为数字
  if (!/^\d*$/.test(value)) {
    if (!subTaskErrors.value[subTask.id]) {
      subTaskErrors.value[subTask.id] = {};
    }
    subTaskErrors.value[subTask.id].progress = '请输入数字';
    return;
  }
  
  if (subTaskErrors.value[subTask.id]) {
    subTaskErrors.value[subTask.id].progress = undefined;
  }
  
  updateSubTask({
    ...subTask,
    progress: value ? parseInt(value) : undefined
  });
};

const updateSubTaskTotal = (subTask: SubTask, event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  
  // 验证输入是否为数字
  if (!/^\d*$/.test(value)) {
    if (!subTaskErrors.value[subTask.id]) {
      subTaskErrors.value[subTask.id] = {};
    }
    subTaskErrors.value[subTask.id].total = '请输入数字';
    return;
  }
  
  if (subTaskErrors.value[subTask.id]) {
    subTaskErrors.value[subTask.id].total = undefined;
  }
  
  updateSubTask({
    ...subTask,
    total: value ? parseInt(value) : undefined
  });
};

const deleteTask = () => {
  emit('delete', props.task.id);
};

const deleteSubTask = (subTaskId: number) => {
  const updatedSubTasks = props.task.subTasks.filter(t => t.id !== subTaskId);
  emit('update', {
    ...props.task,
    subTasks: updatedSubTasks
  });
};

const addSubTask = (type: 'text' | 'toggle') => {
  const newSubTask: SubTask = {
    id: Date.now(),
    type,
    content: '',
    completed: type === 'toggle' ? false : undefined
  };
  
  emit('update', {
    ...props.task,
    subTasks: [...props.task.subTasks, newSubTask]
  });
  
  isOpen.value = false;
};
</script>

<template>
  <div class="task-item bg-white rounded-lg shadow-sm p-4 mb-3" :class="{ 'ml-6': level && level > 0 }">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3 flex-1">
        <template v-if="task.completed !== undefined">
          <ToggleSwitch 
            :model-value="task.completed"
            @update:model-value="toggleCompleted"
          />
        </template>
        <input 
          type="text" 
          :value="task.taskType"
          @input="updateTaskType"
          class="w-1/6 bg-gray-200 border-0 focus:ring-1 focus:ring-primary rounded p-1 text-gray-800"
          placeholder="类型..."
        />
        <select
          :value="task.difficulty"
          @change="updateTaskDifficulty"
          class="w-1/6 bg-gray-200 border-0 focus:ring-1 focus:ring-primary rounded p-1 text-gray-800"
        >
          <option value="" disabled selected>难度...</option>
          <option v-for="difficulty in difficulties" :key="difficulty" :value="difficulty">
            {{ difficulty }}
          </option>
        </select>
        <div class="w-1/6 relative">
          <input 
            type="text" 
            :value="task.priority"
            @input="updateTaskPriority"
            class="w-full bg-gray-200 border-0 focus:ring-1 focus:ring-primary rounded p-1 text-gray-800"
            :class="{ 'border-red-500': priorityError }"
            placeholder="优先级..."
          />
          <div v-if="priorityError" class="absolute text-xs text-red-500 mt-1">{{ priorityError }}</div>
        </div>
        <input 
          type="text" 
          :value="task.content"
          @input="updateTaskContent"
          class="w-2/6 bg-gray-200 border-0 focus:ring-1 focus:ring-primary rounded p-1 text-gray-800"
          :class="{ 'line-through text-gray-400': task.completed }"
          placeholder="点此修改目标内容..."
        />
        
        <!-- 进度和总量文本框 -->
        <div class="flex items-center gap-2">
          <div class="relative">
            <input 
              type="text" 
              :value="task.progress"
              @input="updateTaskProgress"
              class="w-16 bg-gray-200 border-0 focus:ring-1 focus:ring-primary rounded p-1 text-gray-800 text-center"
              :class="{ 'border-red-500': progressError }"
              placeholder="进度"
            />
            <div v-if="progressError" class="absolute text-xs text-red-500 mt-1">{{ progressError }}</div>
          </div>
          <span class="text-gray-500">/</span>
          <div class="relative">
            <input 
              type="text" 
              :value="task.total"
              @input="updateTaskTotal"
              class="w-16 bg-gray-200 border-0 focus:ring-1 focus:ring-primary rounded p-1 text-gray-800 text-center"
              :class="{ 'border-red-500': totalError }"
              placeholder="总量"
            />
            <div v-if="totalError" class="absolute text-xs text-red-500 mt-1">{{ totalError }}</div>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="flex items-center gap-2">
          <button 
            @click="isOpen = true"
            class="text-gray-500 hover:text-primary transition-colors duration-200"
            title="添加子任务"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          
          <button 
            @click="deleteTask"
            class="text-gray-500 hover:text-red-500 transition-colors duration-200"
            title="删除任务"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- 子任务列表 -->
    <div v-if="task.subTasks && task.subTasks.length > 0" class="mt-4 pl-6 border-l-2 border-gray-100">
      <div v-for="subTask in task.subTasks" :key="subTask.id" class="flex items-center gap-3 mb-2">
        <template v-if="subTask.type === 'toggle'">
          <ToggleSwitch 
            :model-value="!!subTask.completed"
            @update:model-value="updateSubTask({ ...subTask, completed: $event })"
          />
        </template>
        
        <input 
          type="text" 
          :value="subTask.content"
          @input="updateSubTask({ ...subTask, content: ($event.target as HTMLInputElement).value })"
          class="flex-1 bg-gray-100 border-0 rounded p-1 text-gray-800 focus:ring-1 focus:ring-primary"
          :class="{ 'line-through text-gray-400': subTask.completed }"
          placeholder="子任务内容..."
        />
        
        <!-- 子任务的进度和总量 -->
        <div v-if="subTask.type === 'text'" class="flex items-center gap-2">
          <div class="relative">
            <input 
              type="text" 
              :value="subTask.progress"
              @input="updateSubTaskProgress(subTask, $event)"
              class="w-12 bg-gray-100 border-0 focus:ring-1 focus:ring-primary rounded p-1 text-gray-800 text-center"
              :class="{ 'border-red-500': subTaskErrors[subTask.id]?.progress }"
              placeholder="进度"
            />
            <div v-if="subTaskErrors[subTask.id]?.progress" class="absolute text-xs text-red-500 mt-1">
              {{ subTaskErrors[subTask.id].progress }}
            </div>
          </div>
          <span class="text-gray-500">/</span>
          <div class="relative">
            <input 
              type="text" 
              :value="subTask.total"
              @input="updateSubTaskTotal(subTask, $event)"
              class="w-12 bg-gray-100 border-0 focus:ring-1 focus:ring-primary rounded p-1 text-gray-800 text-center"
              :class="{ 'border-red-500': subTaskErrors[subTask.id]?.total }"
              placeholder="总量"
            />
            <div v-if="subTaskErrors[subTask.id]?.total" class="absolute text-xs text-red-500 mt-1">
              {{ subTaskErrors[subTask.id].total }}
            </div>
          </div>
        </div>
        
        <button 
          @click="deleteSubTask(subTask.id)"
          class="text-gray-400 hover:text-red-500 transition-colors duration-200"
          title="删除子任务"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
  
  <!-- 添加子任务弹窗 -->
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="isOpen = false" class="relative z-10">
      <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
          <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 mb-4">
            添加子任务
          </DialogTitle>
          
          <div class="mt-4 grid grid-cols-2 gap-4">
            <button
              @click="addSubTask('text')"
              class="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              普通任务
            </button>
            
            <button
              @click="addSubTask('toggle')"
              class="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              可完成任务
            </button>
          </div>
          
          <div class="mt-4 flex justify-end">
            <button
              @click="isOpen = false"
              class="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              取消
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  </TransitionRoot>
</template>