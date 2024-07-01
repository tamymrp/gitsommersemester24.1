// Server Setup 

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/organizer');

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
}).on('error', (error) => {
    console.log('Connection error:', error);
});

const taskSchema = new mongoose.Schema({
    text: { type: String, required: true },
    checked: { type: Boolean, default: false }
});

const Task = mongoose.model('Task', taskSchema);

// GET anfrage -> Laden der Aufgabe 

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Post Anfrage -> Hinzufügen von Aufgabe 

app.post('/tasks', async (req, res) => {
    const task = new Task({
        text: req.body.text,
        checked: req.body.checked
    });
    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// Put Anfrage -> Aktualisieren der Aufgaben 

app.put('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        task.text = req.body.text ?? task.text;
        task.checked = req.body.checked ?? task.checked;

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// Delete Anfrage --> LÖschen von Aufgabe

app.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        await task.deletOne();
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT Anfrage für BULK-UPDATE
app.put('/tasks/bulk-update', async (req, res) => {
    try {
        const updates = req.body;
        const bulkOps = updates.map(task => ({
            updateOne: {
                filter: { _id: task._id },
                update: { $set: { text: task.text, checked: task.checked } }
            }
        }));
        await Task.bulkWrite(bulkOps);
        res.json({ message: 'Tasks updated' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});