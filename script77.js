document.addEventListener('DOMContentLoaded', function() {
    loadTasks('todo-list');
    loadTasks('shopping-list');
});

async function addTask(listId, inputId) {
    const input = document.getElementById(inputId);
    const taskText = input.value.trim();
    if (taskText !== "") {
        const task = { text: taskText, checked: false };
        try {
            const response = await fetch('http://localhost:3000/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(task)
            });
            const newTask = await response.json();
            const taskElement = createTaskElement(newTask);
            document.getElementById(listId).appendChild(taskElement);
            input.value = "";
        } catch (err) {
            console.error('Error adding task:', err);
        }
    }
}

function createTaskElement(task) {
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.checked;
    checkbox.addEventListener('change', updateTasks);
    const span = document.createElement('span');
    span.textContent = task.text;
    span.contentEditable = true;
    span.addEventListener('blur', updateTasks);
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'LÃ¶schen';
    deleteButton.addEventListener('click', async function() {
        try {
            await fetch(`http://localhost:3000/tasks/${task._id}`, {
                method: 'DELETE'
            });
            li.remove();
            updateTasks();
        } catch (err) {
            console.error('Error deleting task:', err);
        }
    });
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteButton);
    return li;
}

async function loadTasks(listId) {
    try {
        const response = await fetch('http://localhost:3000/tasks');
        const tasks = await response.json();
        const list = document.getElementById(listId);
        tasks.forEach(task => {
            const taskElement = createTaskElement(task);
            list.appendChild(taskElement);
        });
    } catch (err) {
        console.error('Error loading tasks:', err);
    }
}

async function updateTasks() {
    const listIds = ['todo-list', 'shopping-list'];
    listIds.forEach(async listId => {
        const listElement = document.getElementById(listId);
        const tasks = [];
        listElement.querySelectorAll('li').forEach(li => {
            const task = {
                _id: li.querySelector('span').dataset.id,
                text: li.querySelector('span').textContent,
                checked: li.querySelector('input').checked
            };
            tasks.push(task);
        });
        try {
            await fetch('http://localhost:3000/tasks/bulk-update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tasks)
            });
        } catch (err) {
            console.error('Error updating tasks:', err);
        }
    });
}