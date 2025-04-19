<script setup lang="ts">
import { ref, computed, watch } from 'vue';

// 定义props和emits
const props = defineProps<{
  modelValue?: Date
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', date: Date): void
}>();

// 当前选中的日期
const selectedDate = ref(props.modelValue || new Date());

// 监听props变化
watch(() => props.modelValue, (newDate) => {
  if (newDate) {
    selectedDate.value = newDate;
  }
});

// 当前显示的月份和年份
const currentMonth = ref(selectedDate.value.getMonth());
const currentYear = ref(selectedDate.value.getFullYear());

// 星期标题
const weekdays = ['一', '二', '三', '四', '五', '六', '日'];

// 计算当前月份的天数
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

// 计算当前月份第一天是星期几（0-6，0表示星期日）
const getFirstDayOfMonth = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1).getDay();
  return firstDay === 0 ? 6 : firstDay - 1; // 调整为星期一为一周的第一天
};

// 计算日历网格
const calendarDays = computed(() => {
  const daysInMonth = getDaysInMonth(currentYear.value, currentMonth.value);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear.value, currentMonth.value);
  
  const days = [];
  
  // 上个月的剩余天数
  const prevMonthDays = getDaysInMonth(
    currentMonth.value === 0 ? currentYear.value - 1 : currentYear.value,
    currentMonth.value === 0 ? 11 : currentMonth.value - 1
  );
  
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push({
      day: prevMonthDays - i,
      month: 'prev',
      date: new Date(
        currentMonth.value === 0 ? currentYear.value - 1 : currentYear.value,
        currentMonth.value === 0 ? 11 : currentMonth.value - 1,
        prevMonthDays - i
      )
    });
  }
  
  // 当前月的天数
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      month: 'current',
      date: new Date(currentYear.value, currentMonth.value, i)
    });
  }
  
  // 下个月的开始几天
  const remainingDays = 42 - days.length; // 6行x7列 = 42
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      day: i,
      month: 'next',
      date: new Date(
        currentMonth.value === 11 ? currentYear.value + 1 : currentYear.value,
        currentMonth.value === 11 ? 0 : currentMonth.value + 1,
        i
      )
    });
  }
  
  return days;
});

// 月份名称
const monthNames = [
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月'
];

// 切换到上个月
const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

// 切换到下个月
const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

// 选择日期
const selectDate = (date: Date) => {
  selectedDate.value = date;
  emit('update:modelValue', date);
};

// 判断日期是否是今天
const isToday = (date: Date) => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

// 判断日期是否是选中的日期
const isSelected = (date: Date) => {
  return date.getDate() === selectedDate.value.getDate() &&
         date.getMonth() === selectedDate.value.getMonth() &&
         date.getFullYear() === selectedDate.value.getFullYear();
};
</script>

<template>
  <div class="calendar-container bg-white rounded-lg shadow-custom overflow-hidden">
    <!-- 日历头部 -->
    <div class="calendar-header flex items-center justify-between p-4 border-b border-gray-100">
      <button 
        @click="prevMonth" 
        class="text-gray-500 hover:text-primary transition-colors duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
      </button>
      
      <div class="text-gray-800 font-medium">
        {{ monthNames[currentMonth] }} {{ currentYear }}
      </div>
      
      <button 
        @click="nextMonth" 
        class="text-gray-500 hover:text-primary transition-colors duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
    
    <!-- 星期标题 -->
    <div class="grid grid-cols-7 text-center py-2 text-xs text-gray-500">
      <div v-for="day in weekdays" :key="day" class="py-1">
        {{ day }}
      </div>
    </div>
    
    <!-- 日历格子 -->
    <div class="grid grid-cols-7 text-sm">
      <div 
        v-for="(day, index) in calendarDays" 
        :key="index"
        @click="selectDate(day.date)"
        class="aspect-square flex items-center justify-center relative cursor-pointer"
        :class="{
          'text-gray-400': day.month !== 'current',
          'text-gray-900 rounded-lg': day.month === 'current',
          'bg-positive text-white rounded-lg ': isSelected(day.date),
          'hover:bg-[rgb(182,182,182)]': !isSelected(day.date)
        }"
      >
        {{ day.day }}
        <span 
          v-if="isToday(day.date) && !isSelected(day.date)" 
          class="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
        ></span>
      </div>
    </div>
  </div>
</template>