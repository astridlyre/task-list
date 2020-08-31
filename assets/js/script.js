// Task list class
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
    // assign properties
    // text input
    this._input = input;
    // important checkbox
    this._isImportant = isImportant;
    // filter by important button
    this._filterByImportant = filterByImportant;
    // initial state of filter
    this._filterImportant = false;
    // filter by text input
    this._filterByText = filterByText;
    // add task form
    this._form = form;
    // output ul element
    this._output = output;
    // clear tasks button
    this._clearBtn = clearBtn;
    // array of task items for storage and iteration
    this._taskItems = taskItems;
    // add event handlers
    this._filterByText.addEventListener("input", (e) =>
      this.filterByText(e.target.value)
    );
    this._form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.addTaskItem(this.input.value);
    });
    this._clearBtn.addEventListener("click", () => this.clearTasks());
    this._filterByImportant.addEventListener("click", () =>
      this.filterImportant()
    );
  }
  // getters and setters
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
  set input(value) {
    this._input.value = value;
  }
  // methods
  addTaskItem(value) {
    const newTask = new taskItem({
      content: value,
      createdOn: new Date(),
      id: this.generateId(),
      important: this.isImportant,
      parent: this,
    });
    this._taskItems
      ? (this._taskItems = this._taskItems.concat(newTask))
      : (this._taskItems = [].concat([newTask]));
    this.output.appendChild(newTask.render());
    this.saveTasks();
    this.input.value = "";
  }
  generateId() {
    return new Date().getTime();
  }
  clearTasks() {
    this._taskItems.forEach((item) => item.deleteSelf());
    this._taskItems = [];
    this.saveTasks();
  }
  saveTasks() {
    const payload = [];
    this._taskItems.forEach((task) => {
      let obj = {
        content: task.content,
        createdOn: task.createdOn,
        id: task.id,
        important: task.important,
      };
      payload.push(obj);
    });
    localStorage.setItem("tasks", JSON.stringify(payload));
  }
  loadTasks() {
    const storage = JSON.parse(localStorage.getItem("tasks"));
    if (storage) {
      storage.forEach((task) => {
        const newTask = new taskItem({
          content: task.content,
          createdOn: task.createdOn,
          id: task.id,
          important: task.important,
          parent: this,
        });
        this._taskItems.push(newTask);
        this.output.appendChild(newTask.render());
      });
    }
  }
  toggleImportant(id) {
    const itemToChange = this._taskItems.find((item) => item.id === id);
    itemToChange.toggleImportant();
    this.saveTasks();
    this.filterImportant(false);
  }
  filterImportant(toggle = true) {
    if (toggle) this._filterImportant = !this._filterImportant;
    if (this._filterImportant) {
      this._taskItems.forEach((item) => {
        if (!item.important)
          document.getElementById(item.id).style.display = "none";
      });
      this._filterByImportant.classList.add("important-on");
    } else {
      this._taskItems.forEach((item) => {
        document.getElementById(item.id).style.display = "flex";
      });
      this._filterByImportant.classList.remove("important-on");
    }
  }
  filterByText(value) {
    if (!value) {
      this._taskItems.forEach((item) => {
        item.showSelf();
      });
      return;
    }
    this._taskItems.forEach((item) => {
      if (!item.content.toLowerCase().includes(value.toLowerCase())) {
        item.hideSelf();
      } else {
        item.showSelf();
      }
    });
  }
  removeTaskItem(id) {
    this._taskItems
      ? (this._taskItems = this._taskItems.filter((task) => task.id !== id))
      : (this._taskItems = []);
    this.saveTasks();
  }
}

// task list item class
class taskItem {
  constructor({ content, createdOn, id, important, parent }) {
    this._content = content;
    (this._createdOn = createdOn),
      (this._id = id),
      (this._important = important);
    this._parent = parent;
    this._isEditing = false;
    this._importantIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

    this._editIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;
  }
  get content() {
    return this._content;
  }
  get createdOn() {
    return this._createdOn;
  }
  get id() {
    return this._id;
  }
  get important() {
    return this._important;
  }
  toggleEdit() {
    this._isEditing = !this._isEditing;
    let textBox = document.getElementById(`${this.id}-span`);
    let editBtn = document.getElementById(`${this.id}-edit-btn`);
    if (this._isEditing) {
      editBtn.classList.add("important-on");
      textBox.contentEditable = "true";
      textBox.focus();
      document.execCommand("selectAll", false, null);
      textBox.onkeypress = () => {
        if (event.key === "Enter") this.toggleEdit();
      };
    } else {
      editBtn.classList.remove("important-on");
      textBox.contentEditable = "false";
      this._content = textBox.innerText;
      this._parent.saveTasks();
    }
  }
  toggleImportant() {
    this._important = !this._important;
    const importantBtn = document.getElementById(`${this.id}-important-btn`);
    if (this.important) {
      importantBtn.classList.add("important-on");
    } else {
      importantBtn.classList.remove("important-on");
    }
    this._parent.filterImportant(false);
    this._parent.saveTasks();
  }
  deleteSelf() {
    this._parent.removeTaskItem(this.id);
    document.getElementById(this.id).remove();
  }
  hideSelf() {
    document.getElementById(this.id).style.display = "none";
  }
  showSelf() {
    document.getElementById(this.id).style.display = "flex";
  }
  render() {
    const li = document.createElement("li");
    li.classList.add("task-list-item");
    li.id = this.id;

    const importantBtn = document.createElement("button");
    importantBtn.classList.add("task-list-important-btn");
    importantBtn.innerHTML = this._importantIcon;
    importantBtn.id = `${this.id}-important-btn`;
    if (this.important) {
      importantBtn.classList.add("important-on");
    }
    importantBtn.addEventListener("click", () => this.toggleImportant());

    const span = document.createElement("span");
    span.classList.add("task-list-span");
    span.id = `${this.id}-span`;
    span.innerHTML = this.content;

    const editBtn = document.createElement("button");
    editBtn.classList.add("task-list-edit-btn");
    editBtn.id = `${this.id}-edit-btn`;
    editBtn.innerHTML = this._editIcon;
    editBtn.addEventListener("click", () => this.toggleEdit());

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("task-list-btn");
    deleteBtn.id = `${this.id}-delete-btn`;
    deleteBtn.innerText = "x";
    deleteBtn.addEventListener("click", () => this.deleteSelf());

    const leftContainer = document.createElement("div");
    leftContainer.classList.add("task-list-container");

    const rightContainer = document.createElement("div");
    rightContainer.classList.add("task-list-container");

    li.appendChild(leftContainer);
    li.appendChild(rightContainer);
    leftContainer.appendChild(importantBtn);
    leftContainer.appendChild(span);
    rightContainer.appendChild(editBtn);
    rightContainer.appendChild(deleteBtn);

    return li;
  }
}

// initialize the task list
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

// retrieve tasks from local storage on load
document.addEventListener("DOMContentLoaded", (event) => {
  myTaskList.loadTasks();
});
