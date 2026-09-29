const API = "/tasks";


// Load tasks
async function loadTasks() {
    try {
        const response = await axios.get(API);
let tasks = response.data;

const sortInput = document.getElementById("sortInput");

if (sortInput && sortInput.value === "oldest") {
    tasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
} else {
    tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

        const taskList = document.getElementById("taskList");
        taskList.innerHTML = "";

        tasks.forEach(task => {

            const li = document.createElement("li");

            const title = document.createElement("span");
           title.textContent = `${task.title} [${task.category}]`;

            if (task.completed) {
                title.classList.add("completed");
            }

            const completeButton = document.createElement("button");
            completeButton.textContent =
                task.completed ? "Undo" : "Complete";

            completeButton.onclick = function () {
                toggleTask(task._id, !task.completed);
            };


            const editButton = document.createElement("button");
            editButton.textContent = "Edit";

            editButton.onclick = function () {
                editTask(task._id, task.title);
            };


            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";

            deleteButton.onclick = function () {
                deleteTask(task._id);
            };


            const buttons = document.createElement("div");

            buttons.appendChild(completeButton);
            buttons.appendChild(editButton);
            buttons.appendChild(deleteButton);

            li.appendChild(title);
            li.appendChild(buttons);

            taskList.appendChild(li);
        });

    } catch (error) {
        console.error("Error loading tasks:", error);
    }
}


// Add task
async function addTask() {

    const input = document.getElementById("taskInput");
const categoryInput = document.getElementById("categoryInput");

const title = input.value.trim();
const category = categoryInput.value;

    if (!title) {
        alert("Please enter a task");
        return;
    }

    try {

       await axios.post(API, {
    title: title,
    category: category
});

        input.value = "";

        loadTasks();

    } catch (error) {
        console.error("Error adding task:", error);
    }
}


// Complete / Undo
async function toggleTask(id, completed) {

    try {

        await axios.put(`${API}/${id}`, {
            completed: completed
        });

        loadTasks();

    } catch (error) {
        console.error("Error updating task:", error);
    }
}


// EDIT TASK
async function editTask(id, oldTitle) {

    const newTitle = prompt(
        "Enter the new task title:",
        oldTitle
    );

    if (newTitle === null) {
        return;
    }

    if (newTitle.trim() === "") {
        alert("Task title cannot be empty");
        return;
    }

    try {

        const response = await axios.put(`${API}/${id}`, {
            title: newTitle.trim()
        });

        console.log("Updated task:", response.data);

        loadTasks();

    } catch (error) {

        console.error("Error editing task:", error);

    }
}


// Delete task
async function deleteTask(id) {

    try {

        await axios.delete(`${API}/${id}`);

        loadTasks();

    } catch (error) {

        console.error("Error deleting task:", error);

    }
}


// Start application
loadTasks();