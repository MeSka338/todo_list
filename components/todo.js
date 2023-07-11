// VARIABLES
const Input = document.querySelector("#todosInput");
const form = document.querySelector("#form");
const todoList = document.querySelector("#todoList");
const counter = document.querySelector("#counter");
const clearChecked = document.querySelector("#clearChecked");
const todoPages = document.querySelector("#todoPages");
const sellectAll = document.querySelector("#sellectAll");

let tasks = []; // the list of tasks
let taskCount; // for displayng the quantity of tasks in the list
let filterMode = 1; // for filterring of task displaing. 1 - All (displays All tasks), 2 - Active, 3 - Complited
let doneMode = 0; // used in doneAll fuction for correct sellecting

// LISTENERS
window.addEventListener("click", (e) => {
  if (editText && e.target !== editText) {
    saveEdit();
  }
});
todoList.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && editText) {
    saveEdit();
  }
});

todoPages.addEventListener("click", filter);
form.addEventListener("submit", addTask);
todoList.addEventListener("click", deleteTask);
todoList.addEventListener("click", doneTask);
todoList.addEventListener("dblclick", editTask);
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

if (localStorage.getItem("doneMode") !== undefined) {
  doneMode = JSON.parse(localStorage.getItem("doneMode"));
  console.log(doneMode);
}
/**
 * ALL FUNCTIONS
 */

// toggle marking all tasks as done or active
function doneAll() {
  doneMode = !doneMode;
  console.log(doneMode);

  tasks.forEach((task) => {
    task.checked = doneMode;
  });

  localStorage.setItem("doneMode", doneMode);
  saveLocal();
  update();
}

// Toggle task display modes
function filter(e) {
  for (let i = 0; i < todoPages.childElementCount; i++) {
    todoPages.children.item(i).classList.remove("page--active");
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
  if ([...e.target.classList].includes("todo-item__remove")) {
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
  if ([...e.target.classList].includes("todo-item__checked")) {
    const item = e.target.closest(".todo-item");
    const id = item.id;
    const task = tasks.find((task) => task.id == id);

    task.checked = !task.checked;

    saveLocal();
    update();
  }
}

// makes the task editable
let editText;
function editTask(e) {
  if ([...e.target.classList].includes("todo-item__value")) {
    editText = e.target;
    editText.classList.add("focus");

    const Parent = editText.closest(".todo-item");
    const checkbox = Parent.querySelector(".fake-checked");
    const deleteBtn = Parent.querySelector(".todo-item__remove");

    e.target.removeAttribute("readonly");
    checkbox.style.display = "none";
    deleteBtn.style.display = "none";
    editText.classList.remove("todo-item__value--checked");
    saveLocal();
  }
}

// saves the edit and makes the task noneditable
function saveEdit() {
  const Parent = editText.closest(".todo-item");
  const Id = Parent.id;

  tasks.forEach((task) => {
    if (task.id === Id) {
      task.text = editText.value;
    }
  });

  editText = null;

  saveLocal();
  update();
}

// clears all completed tasks
function removeChecked() {
  tasks.forEach((task) => {
    if (task.checked) {
      todoList.querySelector(`#${task.id}`).remove();
      tasks = tasks.filter((task) => task.checked !== true);
    }
  });

  saveLocal();
  counter.textContent = `${tasks.length + " items"}`;
}

// task template
function render(task) {
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
        <input type="text" class=${textCss} value=${taskText} readonly
  ></input>
        <button class="todo-item__remove button">
          <img src="icons/close.svg" alt="rem"></img>

      </li>`;

  todoList.insertAdjacentHTML("afterbegin", Task);
}

// function for rerendering all tasks desplay while something changes
function update() {
  let lis;
  while ((lis = todoList.getElementsByTagName("li")).length > 0) {
    todoList.removeChild(lis[0]);
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
