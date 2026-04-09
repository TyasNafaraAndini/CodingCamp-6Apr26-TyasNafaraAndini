// =======================
// DARK MODE
// =======================
const toggleMode = document.getElementById("toggleMode");

toggleMode.onclick = () => {
  document.body.classList.toggle("dark");
};


// =======================
// NAME (LOCAL STORAGE)
// =======================
const nameInput = document.getElementById("nameInput");
const saveName = document.getElementById("saveName");

saveName.onclick = () => {
  localStorage.setItem("username", nameInput.value);
};

function getName() {
  return localStorage.getItem("username") || "";
}


// =======================
// GREETING
// =======================
function updateTime() {
  const now = new Date();

  const time = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  const date = now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const hour = now.getHours();
  let greeting = "";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";
  else greeting = "Good Evening";

  const name = getName();

  document.getElementById("time").innerText = time;
  document.getElementById("date").innerText = date;
  document.getElementById("greeting").innerText =
    name ? `${greeting}, ${name}` : greeting;
}

setInterval(updateTime, 1000);
updateTime();


// =======================
// TIMER
// =======================
let timeLeft = 1500;
let interval;

function updateTimer() {
  const min = Math.floor(timeLeft / 60);
  const sec = timeLeft % 60;

  document.getElementById("timer").innerText =
    `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

document.getElementById("start").onclick = () => {
  clearInterval(interval);
  interval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateTimer();
    }
  }, 1000);
};

document.getElementById("stop").onclick = () => {
  clearInterval(interval);
};

document.getElementById("reset").onclick = () => {
  timeLeft = 1500;
  updateTimer();
};


// =======================
// TODO LIST
// =======================
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <input type="checkbox" ${task.done ? "checked" : ""}>
      <span style="${task.done ? 'text-decoration: line-through' : ''}">
        ${task.text}
      </span>
      <button onclick="editTask(${index})">Edit</button>
      <button onclick="deleteTask(${index})">Delete</button>
    `;

    li.querySelector("input").onchange = () => {
      tasks[index].done = !tasks[index].done;
      saveTasks();
    };

    list.appendChild(li);
  });
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

document.getElementById("addTask").onclick = () => {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();
  const error = document.getElementById("error");

  if (!text) {
    error.innerText = "Task kosong!";
    return;
  }

  // 🚫 PREVENT DUPLICATE
  const exists = tasks.some(
    t => t.text.toLowerCase() === text.toLowerCase()
  );

  if (exists) {
    error.innerText = "Task sudah ada!";
    return;
  }

  error.innerText = "";

  tasks.push({ text, done: false });
  input.value = "";
  saveTasks();
};

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
}

function editTask(index) {
  const newTask = prompt("Edit task:", tasks[index].text);
  if (newTask) {
    tasks[index].text = newTask;
    saveTasks();
  }
}

renderTasks();


// =======================
// QUICK LINKS
// =======================
let links = JSON.parse(localStorage.getItem("links")) || [];

function renderLinks() {
  const container = document.getElementById("links");
  container.innerHTML = "";

  links.forEach((link, index) => {
    const div = document.createElement("div");

    div.innerHTML = `
      <a href="${link.url}" target="_blank">${link.name}</a>
      <button onclick="deleteLink(${index})">x</button>
    `;

    container.appendChild(div);
  });
}

document.getElementById("addLink").onclick = () => {
  const name = document.getElementById("linkName").value;
  const url = document.getElementById("linkURL").value;

  if (!name || !url) return;

  links.push({ name, url });
  localStorage.setItem("links", JSON.stringify(links));

  renderLinks();
};

function deleteLink(index) {
  links.splice(index, 1);
  localStorage.setItem("links", JSON.stringify(links));
  renderLinks();
}

renderLinks();