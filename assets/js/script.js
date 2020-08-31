class taskList {
  constructor(input, form, output, clearBtn, taskItems) {
    this._input = input;
    this._form = form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.addTaskItem(this.input.value);
    });
    this._output = output;
    this._clearBtn = clearBtn.addEventListener("click", () =>
      this.clearTasks()
    );
    this._taskItems = taskItems;
  }
  get input() {
    return this._input;
  }
  get form() {
    return this._form;
  }
  get output() {
    return this._output;
  }
  get clearBtn() {
    return this._clearBtn;
  }
  get taskItems() {
    return this._taskItems;
  }
  set input(value) {
    this._input.value = value;
  }
  addTaskItem(value) {
    const newTask = {
      content: value,
      createdOn: new Date(),
      id: this.generateId(),
    };
    this._taskItems = this._taskItems.concat(newTask);
    this.createNewTaskEl(newTask);
    this.saveTasks();
    this.input.value = "";
  }
  removeTaskItem(element, id) {
    this._taskItems = this._taskItems.filter((task) => task.id !== id);
    this.output.removeChild(element);
    this.saveTasks();
  }
  generateId() {
    return new Date().getTime();
  }
  createNewTaskEl(newTask) {
    const newTaskEl = document.createElement("li");
    newTaskEl.classList.add("task-list-item");

    const newTaskElSpan = document.createElement("span");
    newTaskElSpan.classList.add("task-list-span");
    newTaskElSpan.innerHTML = newTask.content;

    const newTaskElBtn = document.createElement("button");
    newTaskElBtn.classList.add("task-list-btn");
    newTaskElBtn.innerText = "x";
    newTaskElBtn.addEventListener("click", () =>
      this.removeTaskItem(newTaskEl, newTask.id)
    );

    this.output.appendChild(newTaskEl);
    newTaskEl.appendChild(newTaskElSpan);
    newTaskEl.appendChild(newTaskElBtn);
  }
  clearTasks() {
    this._taskItems = [];
    this.saveTasks();
    while (this.output.firstChild) {
      this.output.removeChild(this.output.firstChild);
    }
  }
  saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(this._taskItems));
  }
  loadTasks() {
    this._tasks = JSON.parse(localStorage.getItem("tasks"));
    this._tasks.forEach((task) => this.addTaskItem(task.content));
  }
}

const myTaskList = new taskList(
  document.getElementById("task-input"),
  document.getElementById("task-input-form"),
  document.getElementById("task-list"),
  document.getElementById("clear-tasks-btn"),
  []
);

document.addEventListener("DOMContentLoaded", (event) => {
  myTaskList.loadTasks();
});
