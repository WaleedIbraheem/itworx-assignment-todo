import { Subject } from "rxjs";

import { Todo } from "./todo.model";

const BASE_URL: string = 'https://jsonplaceholder.typicode.com/todos';
interface ServiceResponse {
  isSuccessful: boolean;
  message: string;
  data: any;
}

export class TodoService {
  private todos: Todo[] = [];
  private todoUpdate = new Subject<Todo[]>();

  async getTodos() : Promise<ServiceResponse> {
    let result: ServiceResponse = {
      isSuccessful: true,
      message: '',
      data: null
    }
    try {
      let apiResult = await fetch(BASE_URL);
      this.todos = await apiResult.json();

      this.todos = this.todos.map((todo) => {
        if (todo.completed) {
          todo.completeData = new Date();
        }
        this.todoUpdate.next([...this.todos]);
        return todo;
      });
      result.data = [...this.todos];
    } catch (error) {
      this.todos = [];
      this.todoUpdate.next([...this.todos]);
      result.isSuccessful = false;
      result.message = 'Error while fetching todos';
    }

    return result;
  }

  getTodoUpdateListener() {
    return this.todoUpdate.asObservable();
  }

  async addTodoItem(title: string): Promise<ServiceResponse> {
    let result: ServiceResponse = {
      isSuccessful: true,
      message: '',
      data: null
    }
    const todo: Todo = {
      id: Math.floor(Math.random() * 1000),
      title: title,
      completed: false,
    };
    try {
      await fetch(BASE_URL, {
        method: 'POST',
        body: JSON.stringify(todo),
        headers: {
          'Content-type': 'application/json',
        },
      });
      this.todos.push(todo);
      this.todoUpdate.next([...this.todos]);
    } catch {
      result.isSuccessful = false;
      result.message = 'Error while adding todo';
    }
    return result;
  }

  async deleteTodoItem(id: number): Promise<ServiceResponse> {
    let result: ServiceResponse = {
      isSuccessful: true,
      message: '',
      data: null
    }
    try {
      await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE'
      });
      this.todos = this.todos.filter((todo) => todo.id !== id);
      this.todoUpdate.next([...this.todos]);
    } catch (error) {
        result.isSuccessful = false;
        result.message = 'Error while deleting todo';
    }
    return result;
  }

  async markTodoItemAsCompleted(id: number): Promise<ServiceResponse> {
    let result: ServiceResponse = {
      isSuccessful: true,
      message: '',
      data: null
    }
    try {
      await fetch(`${BASE_URL}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({completed: true}),
        headers: {
          'Content-type': 'application/json',
        },
      });

      this.todos = this.todos.map((todo) => {
        if (todo.id === id) {
          todo.completed = true;
          todo.completeData = new Date();
        }
        return todo;
      });
      this.todoUpdate.next([...this.todos]);
    } catch (error) {
        result.isSuccessful = false;
        result.message = 'Error while marking todo as completed';
    }
    return result;
  }
}
