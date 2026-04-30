import { getTasks, addTask, toggleTask, removeTask } from "./task.js";

const taskInput  = document.querySelector("#task-input");
const addBtn     = document.querySelector("#add-btn");
const taskList   = document.querySelector("#task-list");
const counter    = document.querySelector("#counter");

const updateCounter = () => {
  counter.textContent = getTasks().filter(t => !t.completed).length;
};

const createTaskItem = (task) => {
  const li = document.createElement("li");
  li.classList.add("task-item");
  li.dataset.id = task.id;
  if (task.completed) li.classList.add("task-item--completed");

  const checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.classList.add("task-item__check");
  checkbox.checked = task.completed;

  const span = document.createElement("span");
  span.classList.add("task-item__text");
  span.textContent = task.text;

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("task-item__delete");
  deleteBtn.setAttribute("title", "Eliminar tarea");
  deleteBtn.dataset.action = "delete";
  deleteBtn.setHTMLUnsafe(
    `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
      <path d="M10 11v6"></path><path d="M14 11v6"></path>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
    </svg>`
  );

  li.append(checkbox, span, deleteBtn);
  return li;
};

const showEmpty = () => {
  if (taskList.querySelector(".task-list__empty")) return;
  const empty = document.createElement("li");
  empty.classList.add("task-list__empty");
  empty.textContent = "No hay tareas. Agrega una para comenzar.";
  taskList.append(empty);
};

const renderTasks = () => {
  taskList.textContent = "";
  const tasks = getTasks();
  if (tasks.length === 0) {
    showEmpty();
  } else {
    tasks.forEach(task => taskList.append(createTaskItem(task)));
  }
  updateCounter();
};

const handleListClick = (e) => {
  const li = e.target.closest(".task-item");
  if (!li) return;

  const id = Number(li.dataset.id);

  if (e.target.closest(".task-item__delete")) {
    removeTask(id);
    li.remove();
    if (taskList.querySelectorAll(".task-item").length === 0) showEmpty();
    updateCounter();
    return;
  }

  if (e.target.classList.contains("task-item__check")) {
    const updated = toggleTask(id);
    li.classList.toggle("task-item--completed", updated.completed);
    updateCounter();
  }
};

const handleAdd = () => {
  const text = taskInput.value.trim();

  if (!text) {
    taskInput.classList.add("error");
    taskInput.focus();
    taskInput.addEventListener("animationend", () => taskInput.classList.remove("error"), { once: true });
    return;
  }

  const emptyMsg = taskList.querySelector(".task-list__empty");
  if (emptyMsg) emptyMsg.remove();

  const task = addTask(text);
  taskList.append(createTaskItem(task));

  taskInput.value = "";
  taskInput.focus();
  updateCounter();
};

export const initUI = () => {
  renderTasks();
  taskList.addEventListener("click", handleListClick);
  addBtn.addEventListener("click", handleAdd);
  taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleAdd();
  });
};