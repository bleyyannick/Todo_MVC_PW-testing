import { test, expect } from '@playwright/test';
import { TodoPage } from './PageObjects/TodoPage';

test.beforeEach(async ({ page }) => {
  await page.goto('/todomvc/#/', { waitUntil: 'networkidle' });
  await expect(page).toHaveTitle(/TodoMVC/);
});

test.describe('Adding tasks', () => {
  test('should add a task', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.addTodo('Learn Playwright');

    const firstTask = todoPage.getTasksFields().first();
    await expect(firstTask).toHaveText('Learn Playwright');
  });

  test('should add several tasks', async ({ page }) => {
    const todoPage = new TodoPage(page);
    const tasks = ['Learn Playwright', 'Write tests', 'Have fun'];
    const taskFields = await todoPage.fillTodoFields(tasks);

    for (const [index, text] of tasks.entries()) {
      await expect(taskFields.nth(index)).toHaveText(text);
    }
  });
});

test.describe('Completing tasks', () => {
  test('should complete a task', async ({ page }) => {
    const todoPage = new TodoPage(page);
    const task = 'Learn Playwright';
    await todoPage.addTodo(task);

    const completedTodo = await todoPage.completeTodo(task);
    await expect(completedTodo).toBeChecked();
  });

  test('should complete multiple tasks', async ({ page }) => {
    const todoPage = new TodoPage(page);
    const tasks = ['Learn Playwright', 'Write tests', 'Have fun'];
    await todoPage.fillTodoFields(tasks);

    const firstTask = tasks[0];
    const completedTodo = await todoPage.completeTodo(firstTask);
    await expect(completedTodo).toBeChecked();

    const thirdTask = tasks[2];
    const thirdTaskCheckbox = await todoPage.completeTodo(thirdTask);
    await expect(thirdTaskCheckbox).toBeChecked();
  });
});

test.describe('Deleting tasks', () => {
  test('should show delete button on hover', async ({ page }) => {
    const todoPage = new TodoPage(page);
    const task = 'Learn Playwright';
    await todoPage.addTodo(task);

    await todoPage.hoverOnTask(task);
    await expect(todoPage.getDeleteButton(task)).toBeVisible();
  });

  test('should delete a task', async ({ page }) => {
    const todoPage = new TodoPage(page);
    const tasks = ['Learn Playwright', 'Learn Cypress', 'Learn Testing Library'];
    await todoPage.fillTodoFields(tasks);

    const taskToDelete = tasks[0];
    await todoPage.deleteTodo(taskToDelete);

    await expect(todoPage.getTaskFieldByName(taskToDelete)).toHaveCount(0);
    await expect(todoPage.getTasksFields()).toHaveCount(tasks.length - 1);
  });
});

test.describe('Editing tasks', () => {
  test('should edit a task', async ({ page }) => {
    const todoPage = new TodoPage(page);
    const task = 'Learn Playwright';
    const editedTask = 'Learn Playwright - Updated';
    await todoPage.addTodo(task);

    await todoPage.editTask(task, editedTask);

    const updatedTask = todoPage.getTaskFieldByName(editedTask);
    await expect(updatedTask).toHaveText(editedTask);
  });
});
