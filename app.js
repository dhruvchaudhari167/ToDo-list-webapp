let tasks = [];

const EDIT_ICON = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTIgMkg5YTIgMiAwIDAgMC0yIDJ2MTRhMiAyIDAgMCAwIDIgMmgxNGEyIDIgMCAwIDAgMi0yVjkiPjwvcGF0aD48cGF0aCBkPSJNMTguNSAyLjVhMi4xMjEgMi4xMjEgMCAwIDEgMyAzTDEyIDE1bC00IDFsMS00IDkuNS05LjV6Ij48L3BhdGg+PC9zdmc+";
const DELETE_ICON = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSIzLDYgNSw2IDIxLDYiPjwvcG9seWxpbmU+PHBhdGggZD0ibTE5LDZ2MTRhMiwyIDAgMCwxLTIsMkg3YTIsMiAwIDAsMS0yLTJWNm0zLDBWNGEyLDIgMCAwLDEsMi0yaDRhMiwyIDAgMCwxLDIsMnYyIj48L3BhdGg+PGxpbmUgeDE9IjEwIiB5MT0iMTEiIHgyPSIxMCIgeTI9IjE3Ij48L2xpbmU+PGxpbmUgeDE9IjE0IiB5MT0iMTEiIHgyPSIxNCIgeTI9IjE3Ij48L2xpbmU+PC9zdmc+";

const getTaskInput = () => document.getElementById('taskInput');
const getTasksList = () => document.querySelector('.task-list');
const getProgressBar = () => document.getElementById('progress');

const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

const updateStats = () => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

    getProgressBar().style.width = `${progress}%`;
    document.getElementById('numbers').innerText = `${completedTasks} / ${totalTasks}`;

    if (totalTasks > 0 && completedTasks === totalTasks) {
        triggerConfetti();
    }
};

const updateTasksList = () => {
    const tasksList = getTasksList();
    tasksList.innerHTML = '';

    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'taskItem';

        const taskRow = document.createElement('div');
        taskRow.className = `task${task.completed ? ' completed' : ''}`;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTaskComplete(index));

        const text = document.createElement('p');
        text.innerText = task.text;

        const icons = document.createElement('div');
        icons.className = 'icons';

        const editIcon = document.createElement('img');
        editIcon.src = EDIT_ICON;
        editIcon.alt = 'Edit';
        editIcon.addEventListener('click', () => editTask(index));

        const deleteIcon = document.createElement('img');
        deleteIcon.src = DELETE_ICON;
        deleteIcon.alt = 'Delete';
        deleteIcon.addEventListener('click', () => deleteTask(index));

        taskRow.appendChild(checkbox);
        taskRow.appendChild(text);
        icons.appendChild(editIcon);
        icons.appendChild(deleteIcon);

        listItem.appendChild(taskRow);
        listItem.appendChild(icons);

        tasksList.appendChild(listItem);
    });

    updateStats();
};

const addTask = () => {
    const text = getTaskInput().value.trim();
    if (!text) return;

    tasks.push({ text, completed: false });
    getTaskInput().value = '';
    saveTasks();
    updateTasksList();
};

const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    updateTasksList();
};

const deleteTask = (index) => {
    tasks.splice(index, 1);
    saveTasks();
    updateTasksList();
};

const editTask = (index) => {
    const newText = prompt('Edit task:', tasks[index].text);
    if (newText === null) return;

    tasks[index].text = newText.trim();
    saveTasks();
    updateTasksList();
};

const triggerConfetti = () => {
    console.log('Confetti triggered!'); // Debug log
    const count = 200;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio, opts) {
        window.confetti(Object.assign({}, defaults, opts, { particleCount: Math.floor(count * particleRatio) }));
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
};

document.addEventListener('DOMContentLoaded', () => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    tasks = Array.isArray(savedTasks) ? savedTasks : [];

    updateTasksList();

    const form = document.querySelector('form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        addTask();
    });

    document.getElementById('new-task').addEventListener('click', (event) => {
        event.preventDefault();
        addTask();
    });
});
