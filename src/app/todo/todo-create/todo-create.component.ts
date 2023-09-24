import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { MatSnackBar } from '@angular/material/snack-bar';

import { TodoService } from "../todo.service";

@Component({
  selector: 'app-todo-create',
  templateUrl: './todo-create.component.html',
  styleUrls: ['./todo-create.component.css']
})
export class TodoCreateComponent {
  constructor(private todoService: TodoService, private snackBar: MatSnackBar) { }

  async onAddTodo(form: NgForm) {
    if (form.invalid) {
      return;
    }
    let result = await this.todoService.addTodoItem(form.value.todoItem);
    if (!result.isSuccessful) {
      this.snackBar.open(result.message, 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }
    form.resetForm();
  }

  async onRefresh() {
    let result = await this.todoService.getTodos();
    if (!result.isSuccessful) {
      this.snackBar.open(result.message, 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
  }
}
