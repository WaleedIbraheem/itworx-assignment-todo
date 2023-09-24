import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { MatSnackBar } from '@angular/material/snack-bar';

import { Todo } from "../todo.model";
import { TodoService } from "../todo.service";

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit, OnDestroy {
  todos: Todo[] = [];
  todoSubscription: Subscription = new Subscription();

  constructor(private todoService: TodoService, private snackBar: MatSnackBar) {
  }

  async onCompleteTodoItem(id: number) {
    let result = await this.todoService.markTodoItemAsCompleted(id);
    console.log(result);
    if (result.isSuccessful === false) {
      this.snackBar.open(result.message, 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
  }

  async onDeleteTodoItem(id: number) {
    let result = await this.todoService.deleteTodoItem(id);
    if (!result.isSuccessful) {
      this.snackBar.open(result.message, 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
  }

  async ngOnInit() {
    let result = await this.todoService.getTodos();
    if (!result.isSuccessful) {
      this.snackBar.open(result.message, 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    this.todos = result.data;
    this.todoSubscription = this.todoService
      .getTodoUpdateListener()
      .subscribe((todos: Todo[]) => {
        this.todos = todos;
      });
  }

  ngOnDestroy(): void {
    this.todoSubscription.unsubscribe();
  }
}
