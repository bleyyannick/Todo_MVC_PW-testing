import { expect, Page } from "@playwright/test";

export class TodoPage { 
    page: Page;

    constructor(page: Page) {
        this.page = page;
     }

     async goto() { 
      await this.page.goto('/todomvc/#/', { waitUntil: 'load', timeout: 60000 }); 
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

     getFilters() {
        return this.page.locator('ul.filters');
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

     async removeAll() {
       const tasks = this.getTasksFields();
       while (await tasks.count() > 0) {
          const task = tasks.first();
          await task.hover();
          await task.getByLabel('Delete').click();
       }
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

     async filterBy(filter: 'All' | 'Active' | 'Completed') {
        const filterButton = this.getFilters().getByRole('link', { name: filter });
        await filterButton.click();
     }

     async expectFilterSelected(filter: 'All' | 'Active' | 'Completed') {
        const filterLink = this.getFilters().getByRole('link', { name: filter });
        await expect(filterLink).toHaveClass(/\bselected\b/);
     }

     async clearCompletedTasks() {
        const clearButton = this.page.getByRole('button', { name: 'Clear completed' });
        await clearButton.click();
     }

}