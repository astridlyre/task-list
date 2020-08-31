class taskList {
  constructor(
    input,
    isImportant,
    filterByImportant,
    filterByText,
    form,
    output,
    clearBtn,
    taskItems
  ) {
    this._input = input;
    this._isImportant = isImportant;
    this._filterByImportant = filterByImportant;
    this._filterByImportant.addEventListener("click", () =>
      this.filterImportant()
    );
    this._filterImportant = false;
    this._filterByText = filterByText;
    this._filterByText.addEventListener("input", (e) =>
      this.filterByText(e.target.value)
    );
    this._form = form;
    this._form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.addTaskItem(this.input.value);
    });
    this._output = output;
    this._clearBtn = clearBtn;
    this._clearBtn.addEventListener("click", () => this.clearTasks());
    this._taskItems = taskItems;
    this._importantIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
  }
  get input() {
    return this._input;
  }
  get isImportant() {
    return this._isImportant.checked;
  }
  get importantIcon() {
    return this._importantIcon;
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
      important: this.isImportant,
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
    newTaskEl.id = newTask.id;

    const newTaskElImportantBtn = document.createElement("button");
    newTaskElImportantBtn.classList.add("task-list-important-btn");
    newTaskElImportantBtn.innerHTML = this.importantIcon;
    if (newTask.important) {
      newTaskElImportantBtn.classList.add("important-on");
    }
    newTaskElImportantBtn.addEventListener("click", () =>
      this.toggleImportant(newTask.id)
    );

    const newTaskElSpan = document.createElement("span");
    newTaskElSpan.classList.add("task-list-span");
    newTaskElSpan.innerHTML = newTask.content;

    const newTaskElBtn = document.createElement("button");
    newTaskElBtn.classList.add("task-list-btn");
    newTaskElBtn.innerText = "x";
    newTaskElBtn.addEventListener("click", () =>
      this.removeTaskItem(newTaskEl, newTask.id)
    );

    const container = document.createElement("div");
    container.classList.add("task-list-container");

    this.output.appendChild(newTaskEl);
    newTaskEl.appendChild(container);
    container.appendChild(newTaskElImportantBtn);
    container.appendChild(newTaskElSpan);
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
    if (this._tasks) {
      this._tasks.forEach((task) => this.addTaskItem(task.content));
    }
  }
  toggleImportant(id) {
    const itemToChange = this._taskItems.find((item) => item.id === id);
    itemToChange.important = !itemToChange.important;
    if (itemToChange.important) {
      document
        .getElementById(id)
        .firstChild.firstChild.classList.add("important-on");
    } else {
      document
        .getElementById(id)
        .firstChild.firstChild.classList.remove("important-on");
    }
    this.saveTasks();
  }
  filterImportant() {
    this._filterImportant = !this._filterImportant;
    if (this._filterImportant) {
      this.taskItems.forEach((item) => {
        if (!item.important)
          document.getElementById(item.id).style.display = "none";
      });
      this._filter.classList.add("important-on");
    } else {
      this.taskItems.forEach((item) => {
        document.getElementById(item.id).style.display = "flex";
      });
      this._filter.classList.remove("important-on");
    }
  }
  filterByText(value) {
    if (!value) {
      this.taskItems.forEach((item) => {
        document.getElementById(item.id).style.display = "flex";
      });
      return;
    }
    this.taskItems.forEach((item) => {
      if (!item.content.toLowerCase().includes(value.toLowerCase())) {
        document.getElementById(item.id).style.display = "none";
      } else {
        document.getElementById(item.id).style.display = "flex";
      }
    });
  }
}

const myTaskList = new taskList(
  document.getElementById("task-input"),
  document.getElementById("important"),
  document.getElementById("filter-by-important"),
  document.getElementById("filter-by-text"),
  document.getElementById("task-input-form"),
  document.getElementById("task-list"),
  document.getElementById("clear-tasks-btn"),
  []
);

document.addEventListener("DOMContentLoaded", (event) => {
  myTaskList.loadTasks();
});
