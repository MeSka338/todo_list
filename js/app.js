const Input = document.querySelector("#todosInput");
const form = document.querySelector(".todo-form");
const taskList = document.querySelector("#taskList");
const counter = document.querySelector("#counter");
const clearChecked = document.querySelector("#clearChecked");
const todosPages = document.querySelector(".todos-pages");
const sellectAll = document.querySelector("#sellectAll");

let tasks = [];

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  tasks.forEach((task) => {
    render(task);
  });
}

if (localStorage.getItem("doneMode")) {
  doneMode = localStorage.getItem("doneMode");
}

todosPages.addEventListener("click", filter);
form.addEventListener("submit", addTask);
taskList.addEventListener("click", deleteTask);
taskList.addEventListener("click", doneTask);
taskList.addEventListener("click", editTask);
clearChecked.addEventListener("click", removeChecked);
sellectAll.addEventListener("click", doneAllToggle);

function editTask(e) {
  if (e.target.classList == "todo-item__edit button") {
    const Parant = e.target.closest(".todo-item");
    const Id = Parant.id;
    const Text = Parant.querySelector(".todo-item__value");
    const task = tasks.find((task) => task.id == Id);
    task.edit = !task.edit;
    task.text = Text.value;
    saveLocal();
    Text.toggleAttribute("readonly");

    console.log(e);
  }
}

function filter(e) {
  switch (e.target.id) {
    case "Active":
      tasks.forEach((task) => {
        taskList.querySelector(`#${task.id}`).style.display = "flex";
        if (task.checked) {
          taskList.querySelector(`#${task.id}`).style.display = "none";
        }
      });
      break;
    case "Complited":
      tasks.forEach((task) => {
        taskList.querySelector(`#${task.id}`).style.display = "flex";
        if (!task.checked) {
          taskList.querySelector(`#${task.id}`).style.display = "none";
        }
      });
      break;
    default:
      tasks.forEach((task) => {
        taskList.querySelector(`#${task.id}`).style.display = "flex";
      });
      break;
  }
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
        <label for=${"checked" + task.id} class="fake-checked"></label>

        <input type="text" class=${textCss}  readonly id="taskText" value="${taskText}"> </input>
        <button class="todo-item__remove button"></button>
        <button class="todo-item__edit button"></button>
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
}

// function doneAllToggle() {
//   tasks.forEach((task) => {
//     if (task.checked !== doneMode) {
//       const Task = taskList.querySelector(`#${task.id}`);

//       Task.querySelector(".todo-item__value").classList.toggle(
//         "todo-item__value--checked"
//       );
//       Task.querySelector(".todo-item__checked").toggleAttribute("checked");

//       task.checked = doneMode;
//     }
//   });
//   doneMode = !doneMode;
//   localStorage.setItem("doneMode", doneMode);
//   saveLocal();
// }
