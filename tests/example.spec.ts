import { test, expect } from '@playwright/test';
import { TodoPage } from './PageObjects/TodoPage';


test.beforeEach('has title', async ({ page }) => {
  await page.goto('/todomvc/#/', {
    waitUntil: 'networkidle'
  });
  await expect(page).toHaveTitle(/TodoMVC/);
});

test('add todo', async ({ page }) => {
  const todo = new TodoPage(page); 
  await todo.addTodo('Learn Playwright');

  const firstTodoInput = todo.getTasksFields().first();
  await expect(todo.getTaskFieldByName('Learn Playwright')).toBeVisible();
  await expect(firstTodoInput).toHaveText('Learn Playwright');

});

test('add several todos', async ({ page }) => {
  const todo = new TodoPage(page); 
  
  const todos = ['Learn Playwright', 'Write tests', 'Have fun'];
  const todoFields = await todo.fillTodoFields(todos);
  
  for (const [index, text] of todos.entries()) {
    await expect(todoFields.nth(index)).toHaveText(text);
  }
  const firstTask = todos[0];
  await expect(todo.getTaskFieldByName(firstTask)).toBeVisible();

  const completedTodo = await todo.completeTodo(firstTask);
  await expect(completedTodo).toBeChecked();

  const thirdTask = todos[2];
  await expect(todo.getTaskFieldByName(thirdTask)).toBeVisible();
  const thirdTaskCheckbox = await todo.completeTodo(thirdTask);
  await expect(thirdTaskCheckbox).toBeChecked();
});

test('delete todo', async ({ page }) => {
  const todo = new TodoPage(page);

  const todos = ['Learn Playwright', 'Learn Cypress', 'Learn Testing Library', 'Learn Jest'];
  await todo.fillTodoFields(todos);

  const firstTask = todos[0];
  await expect(todo.getTaskFieldByName(firstTask)).toBeVisible();
  await todo.completeTodo(firstTask);


  await todo.hoverOnTask(firstTask); 
  await expect(todo.getDeleteButton(firstTask)).toBeVisible();

  await todo.deleteTodo(firstTask);
  expect(todos).toContain(firstTask);
  await expect(todo.getTaskFieldByName(firstTask)).toHaveCount(0);
  await expect(todo.getTasksFields()).toHaveCount(todos.length - 1);

});
