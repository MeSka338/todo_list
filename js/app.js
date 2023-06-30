const Input = document.querySelector("#todosInput");
const form = document.querySelector("#form");
const taskList = document.querySelector("#taskList");
const counter = document.querySelector("#counter");
const clearChecked = document.querySelector("#clearChecked");
const todosPages = document.querySelector("#todoPages");
const sellectAll = document.querySelector("#sellectAll");

let tasks = [];
let taskCount;

todosPages.addEventListener("click", filter);
form.addEventListener("submit", addTask);
taskList.addEventListener("click", deleteTask);
taskList.addEventListener("click", doneTask);
taskList.addEventListener("click", editTask);
clearChecked.addEventListener("click", removeChecked);

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  counter.textContent = `${tasks.length + " items"}`;

  tasks.forEach((task) => {
    render(task);
  });
}

function editTask(e) {
  if (e.target.classList == "todo-item__edit button") {
    const Parant = e.target.closest(".todo-item");
    const Id = Parant.id;
    const Text = Parant.querySelector(".todo-item__value");
    const task = tasks.find((task) => task.id == Id);
    task.edit = !task.edit;
    task.text = Text.textContent;
    saveLocal();
    rerender();
  }
}

function filter(e) {
  while ((lis = taskList.getElementsByTagName("li")).length > 0) {
    taskList.removeChild(lis[0]);
  }
  switch (e.target.id) {
    case "Active":
      tasks.forEach((task) => {
        if (!task.checked) {
          render(task);
        }
      });
      break;
    case "Complited":
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

function rerender() {
  while ((lis = taskList.getElementsByTagName("li")).length > 0) {
    taskList.removeChild(lis[0]);
  }
  tasks.forEach((task) => {
    render(task);
  });
}

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
  render(newTask);
  saveLocal();

  console.log(tasks);

  Input.value = "";
  counter.textContent = `${tasks.length + " items"}`;
}

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
        <p class=${textCss} contenteditable="${
    task.edit ? "true" : "false"
  }">${taskText}</p>
        <button class="todo-item__remove button">
          <img src="/publick/icons/close_FILL0_wght400_GRAD0_opsz48.svg" alt="rem"></img>
        </button>
        <button class="todo-item__edit button">
        <img src="/publick/icons/edit_FILL0_wght400_GRAD0_opsz48.svg" alt="rem"></img>

        </button>
      </li>`;

  taskList.insertAdjacentHTML("afterbegin", Task);
}

function deleteTask(e) {
  if (e.target.classList == "todo-item__remove button") {
    const Item = e.target.closest(".todo-item");
    const Id = Item.id;

    tasks = tasks.filter((task) => task.id !== Id);
    saveLocal();

    Item.remove();
    counter.textContent = `${tasks.length + " items"}`;
  }
}

function doneTask(e) {
  if (e.target.classList == "todo-item__checked") {
    const Item = e.target.closest(".todo-item");
    const Id = Item.id;
    const Task = tasks.find((task) => task.id == Id);
    Task.checked = !Task.checked;
    saveLocal();

    console.log(Task);

    const textItem = Item.querySelector(".todo-item__value");
    textItem.classList.toggle("todo-item__value--checked");
  }
}

function saveLocal() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

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
