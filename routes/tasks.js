const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

// GET all tasks
router.get("/", auth, async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  res.json(tasks);
});

// CREATE task
router.post("/", auth, async (req, res) => {
  try {
    const { text, category, dueDate } = req.body;

    const task = new Task({
      user: req.user.id,
      text,
      category,
      dueDate,
    });

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE task
router.put("/:id", auth, async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) return res.status(404).json({ msg: "Task not found" });

  if (task.user.toString() !== req.user.id) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  const updated = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updated);
});

// DELETE task
router.delete("/:id", auth, async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) return res.status(404).json({ msg: "Task not found" });

  if (task.user.toString() !== req.user.id) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  await task.deleteOne();
  res.json({ msg: "Task removed" });
});

module.exports = router;