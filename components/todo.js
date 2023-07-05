// VARIABLES
const Input = document.querySelector("#todosInput");
const form = document.querySelector("#form");
const taskList = document.querySelector("#taskList");
const counter = document.querySelector("#counter");
const clearChecked = document.querySelector("#clearChecked");
const todosPages = document.querySelector("#todoPages");
const sellectAll = document.querySelector("#sellectAll");

let tasks = []; // the list of tasks
let taskCount; // for displayng the quantity of tasks in the list
let filterMode = 1; // for filterring of task displaing. 1 - All (displays All tasks), 2 - Active, 3 - Complited
let doneMode = 0; // used in doneAll fuction for correct sellecting

// LISTENERS
todosPages.addEventListener("click", filter);
form.addEventListener("submit", addTask);
taskList.addEventListener("click", deleteTask);
taskList.addEventListener("click", doneTask);
taskList.addEventListener("click", editTask);
clearChecked.addEventListener("click", removeChecked);
sellectAll.addEventListener("click", doneAll);

// INITIALIZATION
if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  counter.textContent = `${tasks.length + " items"}`;
  tasks.forEach((task) => {
    render(task);
  });
}

if (localStorage.getItem("doneMode")) {
  doneMode = localStorage.getItem("doneMode");
}
/**
 * ALL FUNCTIONS
 */

// toggle marking all tasks as done or active
function doneAll() {
  doneMode = !doneMode;
  tasks.forEach((task) => {
    task.checked = doneMode;
  });

  console.log(doneMode);
  localStorage.setItem("doneMode", doneMode);
  saveLocal();
  update();
}

// Toggle task display modes
function filter(e) {
  for (let i = 0; i < todosPages.childElementCount; i++) {
    todosPages.children.item(i).classList.remove("page--active");
  }
  switch (e.target.id) {
    case "Active":
      filterMode = 2;
      e.target.classList.add("page--active");

      break;
    case "Complited":
      filterMode = 3;
      e.target.classList.add("page--active");

      break;
    default:
      filterMode = 1;
      e.target.classList.add("page--active");

      break;
  }
  update();
}

// Adds new tasks
function addTask(e) {
  e.preventDefault();

  const textValue = Input.value;

  const newTask = {
    text: textValue,
    checked: false,
    edit: false,
    id: "id" + Date.now(),
  };

  tasks.push(newTask);

  if (filterMode === 1 || filterMode === 2) {
    render(newTask);
  }

  saveLocal();

  Input.value = "";
  counter.textContent = `${tasks.length + " items"}`;
}

// Deletes selected tasks
function deleteTask(e) {
  if (e.target.classList == "todo-item__remove button") {
    const item = e.target.closest(".todo-item");
    const id = item.id;

    tasks = tasks.filter((task) => task.id !== id);
    saveLocal();

    item.remove();
    counter.textContent = `${tasks.length + " items"}`;
  }
}

// Marked task as done
function doneTask(e) {
  if (e.target.classList == "todo-item__checked") {
    const item = e.target.closest(".todo-item");
    const id = item.id;
    const task = tasks.find((task) => task.id == id);

    task.checked = !task.checked;

    saveLocal();
    update();
  }
}

// makes the task editable
function editTask(e) {
  if (e.target.classList == "todo-item__edit button") {
    const parant = e.target.closest(".todo-item");
    const id = parant.id;
    const text = parant.querySelector(".todo-item__value");
    const task = tasks.find((task) => task.id == id);

    task.edit = !task.edit;
    task.text = text.textContent;

    saveLocal();
    update();
  }
}

// clears all completed tasks
function removeChecked() {
  tasks.forEach((task) => {
    if (task.checked) {
      taskList.querySelector(`#${task.id}`).remove();
      tasks = tasks.filter((task) => task.checked !== true);
    }
  });

  saveLocal();
  counter.textContent = `${tasks.length + " items"}`;
}

// task template
function render(task) {
  const taskEdit = task.edit
    ? "save_FILL0_wght400_GRAD0_opsz48"
    : "edit_FILL0_wght400_GRAD0_opsz48";

  const taskText = task.text;

  const textCss = task.checked
    ? `"todo-item__value--checked todo-item__value"`
    : "todo-item__value";

  const Task = `<li class="todo-item" id="${task.id}">
        <input
          type="checkbox"
          class="todo-item__checked"
          name="checked"
          id=${"checked" + task.id}
          ${task.checked ? "checked" : ""}
        />
        <label for=${"checked" + task.id}  class="fake-checked"></label>
        <p class=${textCss} contenteditable="${
    task.edit ? "true" : "false"
  }">${taskText}</p>
        <button class="todo-item__remove button">
          <img src="icons/close_FILL0_wght400_GRAD0_opsz48.svg" alt="rem"></img>
        </button>
        <button class="todo-item__edit button">
          <img src="icons/${taskEdit}.svg" alt="rem"></img>
        </button>
      </li>`;

  taskList.insertAdjacentHTML("afterbegin", Task);
}

// function for rerendering all tasks desplay while something changes
function update() {
  let lis;
  while ((lis = taskList.getElementsByTagName("li")).length > 0) {
    taskList.removeChild(lis[0]);
  }
  switch (filterMode) {
    case 2:
      tasks.forEach((task) => {
        if (!task.checked) {
          render(task);
        }
      });
      break;
    case 3:
      tasks.forEach((task) => {
        if (task.checked) {
          render(task);
        }
      });
      break;
    default:
      tasks.forEach((task) => {
        render(task);
      });
      break;
  }
}

// saves all changes in the local storage
function saveLocal() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
