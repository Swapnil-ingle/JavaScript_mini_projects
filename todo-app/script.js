const form = document.getElementById('form');
const input = document.getElementById('input');
const todos = document.getElementById('todos');

loadTodos();

form.addEventListener('submit', e => {
    e.preventDefault();
    addTodo();
});

function addTodo(localStorageTodoVal = null, completed = null) {
    const todoText = localStorageTodoVal == null ? input.value : localStorageTodoVal;
    console.log("Adding todo element: " + todoText);

    if (todoText) {
        const todoEl = document.createElement('li');
        todoEl.innerText = todoText;

        if (completed == true) {
            todoEl.classList.add('completed');
        }

        todoEl.addEventListener('click', e => {
             todoEl.classList.toggle('completed');
             _updateLs();
        });

        todoEl.addEventListener('contextmenu', e => {
            e.preventDefault();
            todoEl.remove();
            _updateLs();
        });

        todos.appendChild(todoEl);
        input.value = '';
        _updateLs();
    }
}

function loadTodos() {
    document.getElementById('todos').innerHTML = '';
    const todos = _getTodosFromLS();

    todos.forEach(todo => {
        addTodo(todo.text, todo.completed);
    });
}

function _getTodosFromLS() {
    const todos = JSON.parse(localStorage.getItem('todos'));
    return todos == null ? [] : todos;
}

function _updateLs() {
    const todosEl = document.querySelectorAll('li');

    const todos = [];

    todosEl.forEach(todoEl => {
        todos.push({
            text: todoEl.innerText,
            completed: todoEl.classList.contains('completed')
        });
    });

    localStorage.setItem('todos', JSON.stringify(todos));
}