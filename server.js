const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const Task = require("./models/Task");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve frontend
app.use(express.static(path.join(__dirname, "frontend")));

// MongoDB connection
mongoose
    .connect("mongodb://127.0.0.1:27017/taskdb")
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((error) => {
        console.log("MongoDB Error:", error);
    });

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// GET - Get all tasks
app.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// POST - Add a new task
app.post("/tasks", async (req, res) => {
    try {
        const task = new Task({
            title: req.body.title
        });

        const savedTask = await task.save();

        res.status(201).json(savedTask);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

// PUT - Update a task
app.put("/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(task);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

// DELETE - Delete a task
app.delete("/tasks/:id", async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);

        res.json({
            message: "Task deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

// Start server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});