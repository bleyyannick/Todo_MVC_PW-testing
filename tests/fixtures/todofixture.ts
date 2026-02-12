import { test as base } from '@playwright/test';
import { TodoPage } from '../PageObjects/TodoPage';

type TodoFixtures = {
  todoPage: TodoPage;
  seededTodoPage: TodoPage;
};

export const test = base.extend<TodoFixtures>({
  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    await use(todoPage);
    await todoPage.removeAll();
  },
  seededTodoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    const tasks = ['Learn Playwright', 'Write tests', 'Have fun'];
    await todoPage.fillTodoFields(tasks);

    await use(todoPage);
    await todoPage.removeAll();
  },
});
export { expect } from '@playwright/test';