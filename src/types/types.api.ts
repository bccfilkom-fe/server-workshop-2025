/**
 * Generic API response interface
 */
export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

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
