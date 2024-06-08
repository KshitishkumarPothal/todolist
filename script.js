document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const prioritySelect = document.getElementById('prioritySelect');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');

    loadTasks();

    addTaskButton.addEventListener('click', function() {
        addTask();
    });

    taskInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        const priority = prioritySelect.value;

        if (taskText === '') {
            alert('Please enter a task');
            return;
        }

        const task = {
            text: taskText,
            priority: priority,
            completed: false
        };

        createTaskElement(task);
        saveTask(task);

        taskInput.value = '';
        taskInput.focus();
    }

    function createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.priority}`;
        if (task.completed) {
            li.classList.add('completed');
        }

        const span = document.createElement('span');
        span.textContent = task.text;

        const editInput = document.createElement('input');
        editInput.className = 'edit-input';
        editInput.type = 'text';
        editInput.value = task.text;

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', function() {
            if (li.classList.contains('editing')) {
                span.textContent = editInput.value;
                updateTask(task, { text: editInput.value });
                li.classList.remove('editing');
            } else {
                li.classList.add('editing');
            }
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function() {
            taskList.removeChild(li);
            removeTask(task);
        });

        const statusButton = document.createElement('button');
        statusButton.textContent = task.completed ? 'Mark as Pending' : 'Mark as Completed';
        statusButton.addEventListener('click', function() {
            task.completed = !task.completed;
            updateTask(task, { completed: task.completed });
            li.classList.toggle('completed');
            statusButton.textContent = task.completed ? 'Mark as Pending' : 'Mark as Completed';
        });

        li.appendChild(span);
        li.appendChild(editInput);
        li.appendChild(editButton);
        li.appendChild(deleteButton);
        li.appendChild(statusButton);
        taskList.appendChild(li);
    }

    function saveTask(task) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => createTaskElement(task));
    }

    function updateTask(task, updates) {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const index = tasks.findIndex(t => t.text === task.text && t.priority === task.priority);
        tasks[index] = { ...tasks[index], ...updates };
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function removeTask(task) {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const filteredTasks = tasks.filter(t => t.text !== task.text || t.priority !== task.priority);
        localStorage.setItem('tasks', JSON.stringify(filteredTasks));
    }
});
