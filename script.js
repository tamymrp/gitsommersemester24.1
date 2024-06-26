document.addEventListener('DOMContentLoaded', function() {
    loadTasks('todo-list');
    loadTasks('shopping-list');
});

function addTask(listId, inputId) {
    const input = document.getElementById(inputId);
    const taskText = input.value.trim();
    if (taskText !== "") {
        const task = { text: taskText, checked: false };
        const taskElement = createTaskElement(task);
        document.getElementById(listId).appendChild(taskElement);
        saveTask(listId, task);
        input.value = "";
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
    deleteButton.textContent = 'Löschen';
    deleteButton.addEventListener('click', function() {
        li.remove();
        updateTasks();
    });
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteButton);
    return li;
}

function saveTask(listId, task) {
    const tasks = JSON.parse(localStorage.getItem(listId)) || [];
    tasks.push(task);
    localStorage.setItem(listId, JSON.stringify(tasks));
}

function loadTasks(listId) {
    const list = document.getElementById(listId);
    const tasks = JSON.parse(localStorage.getItem(listId)) || [];
    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        list.appendChild(taskElement);
    });
}

function updateTasks() {
    ['todo-list', 'shopping-list'].forEach(listId => {
        const listElement = document.getElementById(listId);
        const tasks = [];
        listElement.querySelectorAll('li').forEach(li => {
            const task = {
                text: li.querySelector('span').textContent,
                checked: li.querySelector('input').checked
            };
            tasks.push(task);
        });
        localStorage.setItem(listId, JSON.stringify(tasks));
    });
}
