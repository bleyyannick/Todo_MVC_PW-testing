import { Page } from "@playwright/test";

export class TodoPage { 
    page: Page;
    tasksList: string[] = [];

    constructor(page: Page) {
        this.page = page;
        this.tasksList = [];
     }

     
     getTasksList() {
        return [...this.tasksList];
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

     private addTask(task: string) {
        this.tasksList.push(task);
     }

     private deleteTask(todo: string) {
        this.tasksList = this.tasksList.filter(task => task !== todo);
     }

     async addTodo(todo: string) {
        const input = this.page.getByPlaceholder('What needs to be done?');
        await input.click();
        await input.fill(todo);
        await input.press('Enter');
        this.addTask(todo);
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
        this.deleteTask(task);
        this.addTask(newTask);
     }

     
     async deleteTodo(todo: string) {
        const taskToDelete = await this.hoverOnTask(todo);
        const deleteButton = this.getDeleteButton(todo);
        await deleteButton.click();
        this.deleteTask(todo);
     } 

}