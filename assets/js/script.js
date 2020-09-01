// Task list class
class TaskList {
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
    // _props are just for functionality
    this.input = input;
    this.isImportant = isImportant;
    this.filterByImportant = filterByImportant;
    this._filterImportant = false;
    this._filterByText = filterByText;
    this.form = form;
    this.output = output;
    this.clearBtn = clearBtn;
    this.taskItems = taskItems;

    // add event handlers
    this._filterByText.addEventListener("input", (e) =>
      this.filterByText(e.target.value)
    );
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.addTaskItem(this.input.value);
    });
    this.clearBtn.addEventListener("click", () => this.clearTasks());
    this.filterByImportant.addEventListener("click", () =>
      this.filterImportant({ toggle: true })
    );
  }
  // methods
  getIsImportant() {
    return this.isImportant.checked;
  }

  setInputValue(value) {
    this.input.value = value;
  }

  addTaskItem(value) {
    const newTask = new TaskItem({
      content: value,
      createdOn: new Date().toLocaleString(),
      id: this.generateId(),
      important: this.getIsImportant(),
      parent: this,
    });
    this.taskItems
      ? (this.taskItems = this.taskItems.concat(newTask))
      : (this.taskItems = [].concat([newTask]));
    this.output.appendChild(newTask.render());
    this.saveTasks();
    this.setInputValue("");
  }

  generateId() {
    return new Date().getTime();
  }

  clearTasks() {
    this.taskItems.forEach((item) => item.deleteSelf());
    this.taskItems = [];
    this.saveTasks();
  }

  saveTasks() {
    const payload = [];
    this.taskItems.forEach((task) => {
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
        const newTask = new TaskItem({
          content: task.content,
          createdOn: task.createdOn,
          id: task.id,
          important: task.important,
          parent: this,
        });
        this.taskItems.push(newTask);
        this.output.appendChild(newTask.render());
      });
    }
  }

  toggleImportant(id) {
    this.taskItems.find((item) => item.id === id).toggleImportant();
    this.saveTasks();
    this.filterImportant({ toggle: false });
  }

  filterImportant({ toggle }) {
    if (toggle) this._filterImportant = !this._filterImportant;
    if (this._filterImportant) {
      this.taskItems.forEach((item) => {
        if (!item.important) item.hideSelf();
      });
      this.filterByImportant.classList.add("important-on");
    } else {
      this.taskItems.forEach((item) => {
        item.showSelf();
      });
      this.filterByImportant.classList.remove("important-on");
    }
  }

  filterByText(value) {
    if (!value) {
      this.taskItems.forEach((item) => {
        item.showSelf();
      });
      return;
    }
    this.taskItems.forEach((item) => {
      if (item.content.toLowerCase().includes(value.toLowerCase())) {
        item.showSelf();
      } else {
        item.hideSelf();
      }
    });
  }

  removeTaskItem(id) {
    this.taskItems
      ? (this.taskItems = this.taskItems.filter((task) => task.id !== id))
      : (this.taskItems = []);
    this.saveTasks();
  }
}

// task list item class
class TaskItem {
  constructor({ content, createdOn, id, important, parent }) {
    this.content = content;
    this.createdOn = createdOn;
    this.id = id;
    this.important = important;
    this.parent = parent;
    this.isEditing = false;

    // icons
    this._importantIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    this._editIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;

    // element props
    this.li = null;
    this.p = null;
    this.editBtn = null;
    this.importantBtn = null;
    this.deleteBtn = null;
    this.createdOnSpan = null;
  }

  setLi(element) {
    this.li = element;
    return this.li;
  }

  setP(element) {
    this.p = element;
    return this.p;
  }

  setEditBtn(element) {
    this.editBtn = element;
    return this.editBtn;
  }

  setImportantBtn(element) {
    this.importantBtn = element;
    return this.importantBtn;
  }

  setDeleteBtn(element) {
    this.deleteBtn = element;
    return this.deleteBtn;
  }

  setCreatedOnSpan(element) {
    this.createdOnSpan = element;
    return this.createdOnSpan;
  }

  toggleEdit() {
    // first change state of editing
    this.isEditing = !this.isEditing;
    // then handle the next steps
    if (this.isEditing) {
      this.editBtn.classList.add("important-on");
      this.p.contentEditable = "true";
      this.p.focus();
      document.execCommand("selectAll", false, null);
      this.p.onkeypress = () => {
        if (event.key === "Enter") this.toggleEdit();
      };
    } else {
      this.editBtn.classList.remove("important-on");
      this.p.contentEditable = "false";
      window.getSelection().removeAllRanges();
      this.content = this.p.innerText;
      this.parent.saveTasks();
    }
  }

  toggleImportant() {
    this.important = !this.important;
    if (this.important) {
      this.importantBtn.classList.add("important-on");
    } else {
      this.importantBtn.classList.remove("important-on");
    }
    this.parent.filterImportant(false);
    this.parent.saveTasks();
  }

  deleteSelf() {
    this.parent.removeTaskItem(this.id);
    this.li.remove();
  }

  hideSelf() {
    this.li.style.display = "none";
  }

  showSelf() {
    this.li.style.display = "flex";
  }

  render() {
    // create li
    this.setLi(document.createElement("li")).classList.add("task-list-item");

    // create button to toggle importance
    this.setImportantBtn(document.createElement("button")).classList.add(
      "task-list-important-btn"
    );
    this.importantBtn.innerHTML = this._importantIcon;
    if (this.important) {
      this.importantBtn.classList.add("important-on");
    }
    this.importantBtn.addEventListener("click", () => this.toggleImportant());

    // create paragraph with content
    this.setP(document.createElement("p")).classList.add("task-list-p");
    this.p.innerHTML = this.content;

    // create edit button
    this.setEditBtn(document.createElement("button")).classList.add(
      "task-list-edit-btn"
    );
    this.editBtn.innerHTML = this._editIcon;
    this.editBtn.addEventListener("click", () => this.toggleEdit());

    // create delete button
    this.setDeleteBtn(document.createElement("button")).classList.add(
      "task-list-btn"
    );
    this.deleteBtn.innerText = "x";
    this.deleteBtn.addEventListener("click", () => this.deleteSelf());

    this.setCreatedOnSpan(document.createElement("span")).classList.add(
      "task-list-created-on"
    );
    this.createdOnSpan.innerText = `Created on ${this.createdOn}`;

    // containers
    const leftContainer = document.createElement("div");
    leftContainer.classList.add("task-list-container");
    const pContainer = document.createElement("div");
    pContainer.classList.add("task-list-p-container");
    const rightContainer = document.createElement("div");
    rightContainer.classList.add("task-list-container");

    // add elements together
    this.li.appendChild(leftContainer);
    this.li.appendChild(rightContainer);
    leftContainer.appendChild(this.importantBtn);
    leftContainer.appendChild(pContainer);
    pContainer.appendChild(this.p);
    pContainer.appendChild(this.createdOnSpan);
    rightContainer.appendChild(this.editBtn);
    rightContainer.appendChild(this.deleteBtn);

    // task item ready to send to DOM
    return this.li;
  }
}

// initialize the task list
const myTaskList = new TaskList(
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
