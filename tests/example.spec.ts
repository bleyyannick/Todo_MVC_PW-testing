import { expect } from '@playwright/test';
import { test } from './fixtures/todofixture';


test.describe('Adding tasks', () => {
  test('should add a task', async ({ todoPage }) => {
    await todoPage.addTodo('Learn test automation');

    const firstTask = todoPage.getTasksFields().first();
    await expect(firstTask).toHaveText('Learn test automation');
  });

  test('should not add an empty task', async ({ todoPage }) => {
   
    const initialCount = await todoPage.getTasksFields().count();
    await todoPage.addTodo('');
    const numberOfTasks = await todoPage.getTasksFields().count();

     expect(numberOfTasks).toBe(initialCount);
  });

  test('should not add a task with only spaces', async ({ todoPage }) => {
    const initialCount = await todoPage.getTasksFields().count();
    await todoPage.addTodo('   ');
    const numberOfTasks = await todoPage.getTasksFields().count();

     expect(numberOfTasks).toBe(initialCount);
  });

  test('should not add a task with only tabs', async ({ todoPage }) => {
    const initialCount = await todoPage.getTasksFields().count();
    await todoPage.addTodo('\t\t');
    const numberOfTasks = await todoPage.getTasksFields().count();
    expect(numberOfTasks).toBe(initialCount);
  
  });

  test('should not add a task with only newlines', async ({ todoPage }) => {
    const initialCount = await todoPage.getTasksFields().count();
    await todoPage.addTodo('\n\n');
    const numberOfTasks = await todoPage.getTasksFields().count();

    expect(numberOfTasks).toBe(initialCount);
  });

  // test('should not add same task twice', async ({ page }) => {
  //   const todoPage = new TodoPage(page);
  //   const task = 'Learn Playwright';
  //   await todoPage.addTodo(task);
  //   await todoPage.addTodo(task);

  //   expect(todoPage.getTasksList()).toHaveLength(1);
  //   await expect(todoPage.getTasksFields()).toHaveCount(1);
  // });

  test('should add several tasks', async ({ todoPage }) => {
    
    const tasks = ['Learn test automation', 'Write tests', 'Have fun'];
    const taskFields = await todoPage.fillTodoFields(tasks);

    for (const [index, text] of tasks.entries()) {
      await expect(taskFields.nth(index)).toHaveText(text);
    }
  });
});

test.describe('Completing tasks', () => {
  test('should complete a task', async ({ seededTodoPage }) => {
    const task = 'Learn Playwright';

    const completedTodo = await seededTodoPage.completeTodo(task);
    await expect(completedTodo).toBeChecked();
  });

  test('should complete multiple tasks', async ({ seededTodoPage }) => {
    const tasks = ['Learn Playwright', 'Write tests', 'Have fun'];

    const firstTask = tasks[0];
    const completedTodo = await seededTodoPage.completeTodo(firstTask);
    await expect(completedTodo).toBeChecked();

    const thirdTask = tasks[2];
    const thirdTaskCheckbox = await seededTodoPage.completeTodo(thirdTask);
    await expect(thirdTaskCheckbox).toBeChecked();
  });
});

test.describe('Deleting tasks', () => {
  test('should show delete button on hover', async ({ seededTodoPage }) => {
    const task = 'Learn Playwright';

    await seededTodoPage.hoverOnTask(task);
    await expect(seededTodoPage.getDeleteButton(task)).toBeVisible();
  });

  test('should delete a task', async ({ seededTodoPage }) => {
    const task = 'Write tests';

    await seededTodoPage.deleteTodo(task);
    await expect(seededTodoPage.getTaskFieldByName(task)).toHaveCount(0);
  });

  test('should delete all tasks', async ({ seededTodoPage }) => {
    await seededTodoPage.removeAll();
    await expect(seededTodoPage.getTasksFields()).toHaveCount(0);
  });
});

test.describe('Editing tasks', () => {
  test('should edit a task', async ({ seededTodoPage }) => {
    const task = 'Learn Playwright';
    const editedTask = 'This task has been edited';

    await seededTodoPage.editTask(task, editedTask);

    const updatedTask = seededTodoPage.getTaskFieldByName(editedTask);
    await expect(updatedTask).toHaveText(editedTask);
  });

  test('should delete a task updated with empty string', async ({ seededTodoPage }) => {
    const task = 'Write tests';

    const initialCount = await seededTodoPage.getTasksFields().count();
    await seededTodoPage.editTask(task, '');
    const numberOfTasks = await seededTodoPage.getTasksFields().count();

    expect(numberOfTasks).toBe(initialCount - 1);
  });
});
