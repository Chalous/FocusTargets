import type { Task } from '../types/task';

/**
 * 任务数据层 - 负责与后端API交互获取任务数据
 */
export class TaskRepository {
  private static API_BASE_URL = '/api'; // 实际项目中应该从配置文件中读取

  /**
   * 根据日期获取任务列表
   * @param date 需要获取任务的日期
   * @returns Promise<Task[]> 任务列表
   */
  static async getTasks(date: Date): Promise<Task[]> {
    // 这里是模拟API调用，实际项目中应使用fetch或axios等库发送请求
    // 例如: return fetch(`${this.API_BASE_URL}/tasks?date=${date.toISOString()}`).then(res => res.json());
    
    // 模拟网络请求
    return new Promise((resolve) => {
      setTimeout(() => {
        // 模拟的任务数据
        const tasks: Task[] = [
          {
            id: 1,
            content: '完成项目设计',
            completed: false,
            subTasks: []
          },
          {
            id: 2,
            content: '准备演示文稿',
            completed: true,
            subTasks: [
              {
                id: 21,
                type: 'text',
                content: '使用简约风格的幻灯片模板'
              },
              {
                id: 22,
                type: 'toggle',
                content: '添加项目截图',
                completed: false
              }
            ]
          },
          {
            id: 3,
            content: '团队会议',
            completed: false,
            subTasks: []
          }
        ];
        resolve(tasks);
      }, 300); // 模拟网络延迟
    });
  }

  /**
   * 创建新任务
   * @param task 要创建的任务对象
   * @returns Promise<Task> 创建成功后的任务
   */
  static async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    // 实际项目中应使用POST请求创建任务
    // 例如: return fetch(`${this.API_BASE_URL}/tasks`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(task)
    // }).then(res => res.json());

    // 模拟创建任务的API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTask: Task = {
          ...task,
          id: Date.now()
        };
        resolve(newTask);
      }, 300);
    });
  }

  /**
   * 更新任务
   * @param task 要更新的任务对象
   * @returns Promise<Task> 更新成功后的任务
   */
  static async updateTask(task: Task): Promise<Task> {
    // 实际项目中应使用PUT或PATCH请求更新任务
    // 例如: return fetch(`${this.API_BASE_URL}/tasks/${task.id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(task)
    // }).then(res => res.json());

    // 模拟更新任务的API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(task);
      }, 300);
    });
  }

  /**
   * 删除任务
   * @param taskId 要删除的任务ID
   * @returns Promise<boolean> 删除是否成功
   */
  static async deleteTask(taskId: number): Promise<boolean> {
    // 实际项目中应使用DELETE请求删除任务
    // 例如: return fetch(`${this.API_BASE_URL}/tasks/${taskId}`, {
    //   method: 'DELETE'
    // }).then(res => res.ok);

    // 模拟删除任务的API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 300);
    });
  }
}