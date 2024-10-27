const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

let tasks = [];

function formatDate(date) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Intl.DateTimeFormat('pt-BR', options).format(new Date(date));
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/tasks', (req, res) => {
    const formattedTasks = tasks.map(task => ({
        ...task,
        date: formatDate(task.date) 
    }));
    res.json(formattedTasks);
});

app.post('/tasks', (req, res) => {
    const task = {
        id: tasks.length + 1,
        title: req.body.title,
        date: req.body.date || new Date().toISOString().split('T')[0], 
        priority: req.body.priority || 'Baixa',
        completed: false
    };
    tasks.push(task);
    res.status(201).json({ ...task, date: formatDate(task.date) }); 
});

app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId);
    if (!task) return res.status(404).send('Tarefa não encontrada.');

    task.title = req.body.title !== undefined ? req.body.title : task.title;
    task.date = req.body.date !== undefined ? req.body.date : task.date; 
    task.priority = req.body.priority !== undefined ? req.body.priority : task.priority;
    task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;

    res.json({ ...task, date: formatDate(task.date) });
});

app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    tasks = tasks.filter(t => t.id !== taskId);
    res.status(204).send();
});

app.get('/task_list', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'task_list.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
