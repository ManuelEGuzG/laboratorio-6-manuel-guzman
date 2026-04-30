import { loadTasks, saveTasks } from "./storage.js";

export const getTasks = () => loadTasks();

export const addTask = (text) => {
  const tasks = loadTasks();
  const task = { id: Date.now(), text, completed: false };
  tasks.push(task);
  saveTasks(tasks);
  return task;
};

export const toggleTask = (id) => {
  const tasks = loadTasks();
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.completed = !task.completed;
  saveTasks(tasks);
  return task;
};

export const removeTask = (id) => {
  const tasks = loadTasks().filter(t => t.id !== id);
  saveTasks(tasks);
};