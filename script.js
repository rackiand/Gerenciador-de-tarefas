const taskInput = document.getElementById('taskInput');
const dateInput = document.getElementById('dateInput');
const priorityInput = document.getElementById('priorityInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
let contador = localStorage.getItem('contador') ? parseInt(localStorage.getItem('contador')) : 0;

// Função para salvar tarefas no localStorage
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Função para carregar tarefas do localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    taskList.innerHTML = ''; // Limpar lista antes de carregar
    tasks.forEach(task => {
        // Criação de novo item com a estrutura visual adicional
        let novoItem = `
            <div id="${task.id}" class="item">
                <div onclick="marcarTarefa(${task.id})" class="item-icone">
                    <i id="icone_${task.id}" class="mdi mdi-circle-outline"></i>
                </div>
                <div onclick="marcarTarefa(${task.id})" class="item-nome">
                    ${task.title} - ${task.date} - Prioridade: ${task.priority}
                </div>
                <div class="item-botao">
                    <button onclick="deleteTask(${task.id})" class="delete"><i class="mdi mdi-delete"></i> Deletar</button>
                </div>
            </div>
        `;
        taskList.innerHTML += novoItem;
    });
}

// Função para adicionar uma nova tarefa
function addTask() {
    const title = taskInput.value.trim();
    const date = dateInput.value;
    const priority = priorityInput.value;

    if (title) {
        ++contador;
        localStorage.setItem('contador', contador);

        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push({ id: contador, title, date, priority });
        saveTasks(tasks);

        // Limpar campos de entrada
        taskInput.value = '';
        dateInput.value = '';
        priorityInput.value = '';

        loadTasks(); // Atualizar a lista com a nova tarefa
    }
}

// Função para excluir tarefa pelo ID
function deleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.id !== id);
    saveTasks(tasks);
    loadTasks();
}

// Função para marcar tarefa como completa/incompleta
function marcarTarefa(id) {
    var item = document.getElementById(id);
    var classe = item.getAttribute("class");

    if (classe == "item") {
        item.classList.add("clicado");
        var icone = document.getElementById("icone_" + id);
        icone.classList.remove("mdi-circle-outline");
        icone.classList.add("mdi-check-circle");

        item.parentNode.appendChild(item);
    } else {
        item.classList.remove("clicado");
        var icone = document.getElementById("icone_" + id);
        icone.classList.remove("mdi-check-circle");
        icone.classList.add("mdi-circle-outline");
    }
}

// Adicionar evento ao botão de adicionar tarefa
if (addTaskBtn) {
    addTaskBtn.addEventListener('click', addTask);
}

// Carregar tarefas ao iniciar a página
loadTasks();

// Adicionar evento de enter no input de tarefa
taskInput.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        addTask();
    }
});
