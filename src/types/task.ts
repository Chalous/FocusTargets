/**
 * 子任务接口定义
 */
export interface SubTask {
  id: number;
  type: 'text' | 'toggle';
  content: string;
  completed?: boolean;
  progress?: number;
  total?: number;
}

/**
 * 任务接口定义
 */
export interface Task {
  id: number;
  content: string;
  completed: boolean;
  subTasks: SubTask[];
  taskType?: string;
  difficulty?: string;
  priority?: number;
  progress?: number;
  total?: number;
}

/**
 * API响应接口
 */
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}