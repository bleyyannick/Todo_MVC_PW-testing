import { Page } from "@playwright/test";

export class TodoPage { 
    page: Page;

    constructor(page: Page) {
        this.page = page;
     }

     getTasksFields() {
        return this.page.getByTestId('todo-item');
     }

     getTaskFieldByName(name: string) {
        return this.getTasksFields().filter({ hasText: name }).first();
      }

     getDeleteButton(todo: string) {
        return this.getTaskFieldByName(todo).getByLabel('Delete');
     }

     async fillTodoFields(todos: string[]) {
         for (const todoText of todos) {
            await this.addTodo(todoText);
            } 
         return this.getTasksFields();
     }

     async addTodo(todo: string) {
        const input = this.page.getByPlaceholder('What needs to be done?');
        await input.fill(todo);
        await input.press('Enter');
     }

     async completeTodo(todo: string) {
        const todoItem = this.getTaskFieldByName(todo);
        const checkbox = todoItem.locator('input[type="checkbox"]');
        await checkbox.check();
        return checkbox;
     }

     async hoverOnTask(todo: string) {
        const selectedTask = this.getTaskFieldByName(todo);
        await selectedTask.hover();
        return selectedTask;
     }

     async editTask(task: string, newTask: string) {
        const taskField = this.getTaskFieldByName(task);
        await taskField.dblclick();
        const editInput = taskField.locator('input.edit');
        await editInput.fill(newTask);
        await editInput.press('Enter');
     }

     async deleteTodo(todo: string) {
        await this.hoverOnTask(todo);
        const deleteButton = this.getDeleteButton(todo);
        await deleteButton.click();
     } 

}