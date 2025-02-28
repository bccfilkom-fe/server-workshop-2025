/**
 * Todo item interface
 */
export interface ITodo {
  id: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create Todo request interface
 */
export interface ICreateTodoRequest {
  text: string;
}

/**
 * Update Todo request interface
 */
export interface IUpdateTodoRequest {
  text: string;
}

/**
 * Mobile Todo interface
 */
export interface IMobileTodo {
  id: string;
  userId: string;
  title: string;
  desc?: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create Mobile Todo request interface
 */
export interface ICreateMobileTodoRequest {
  title: string;
  desc?: string;
}

/**
 * Update Mobile Todo request interface
 */
export interface IUpdateMobileTodoRequest {
  title?: string;
  desc?: string;
  isCompleted?: boolean;
}
