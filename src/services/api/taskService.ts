import type { Task } from '../../types/task';
import { TaskRepository } from '../../repositories/taskRepository';

/**
 * 任务服务层 - 负责处理业务逻辑，调用数据层获取数据
 */
export class TaskService {
  /**
   * 根据日期获取任务列表
   * @param date 需要获取任务的日期
   * @returns Promise<Task[]> 任务列表
   */
  static async fetchTasksForDate(date: Date): Promise<Task[]> {
    try {
      // 从数据层获取任务数据
      const tasks = await TaskRepository.getTasks(date);
      
      // 在这里可以添加业务逻辑，例如排序、过滤等
      return tasks.sort((a, b) => {
        // 未完成的任务优先显示
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        // 按ID排序（通常意味着按创建时间排序）
        return a.id - b.id;
      });
    } catch (error) {
      console.error('获取任务失败:', error);
      throw error;
    }
  }

  /**
   * 创建新任务
   * @param task 要创建的任务对象
   * @returns Promise<Task> 创建成功后的任务
   */
  static async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    try {
      // 调用数据层创建任务
      return await TaskRepository.createTask(task);
    } catch (error) {
      console.error('创建任务失败:', error);
      throw error;
    }
  }

  /**
   * 更新任务
   * @param task 要更新的任务对象
   * @returns Promise<Task> 更新成功后的任务
   */
  static async updateTask(task: Task): Promise<Task> {
    try {
      // 调用数据层更新任务
      return await TaskRepository.updateTask(task);
    } catch (error) {
      console.error('更新任务失败:', error);
      throw error;
    }
  }

  /**
   * 删除任务
   * @param taskId 要删除的任务ID
   * @returns Promise<boolean> 删除是否成功
   */
  static async deleteTask(taskId: number): Promise<boolean> {
    try {
      // 调用数据层删除任务
      return await TaskRepository.deleteTask(taskId);
    } catch (error) {
      console.error('删除任务失败:', error);
      throw error;
    }
  }
}