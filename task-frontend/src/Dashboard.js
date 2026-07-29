import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API = "http://localhost:5000/api/tasks";

export default function Dashboard({ darkMode, setDarkMode }) {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [category, setCategory] = useState("Personal");
  const [dueDate, setDueDate] = useState("");

  const [editTask, setEditTask] = useState(null);
  const [editText, setEditText] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API, { headers });
      setTasks(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add task
  const addTask = async () => {
    if (!text.trim()) return toast.error("Task cannot be empty");

    try {
      await axios.post(
        API,
        { text, category, dueDate },
        { headers }
      );

      setText("");
      setCategory("Personal");
      setDueDate("");

      fetchTasks();
      toast.success("Task added");
    } catch (err) {
      console.log(err);
      toast.error("Error adding task");
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/${id}`, { headers });
      fetchTasks();
      toast.success("Task deleted");
    } catch (err) {
      console.log(err);
      toast.error("Delete failed");
    }
  };

  // Toggle complete
  const toggleTask = async (task) => {
    try {
      await axios.put(
        `${API}/${task._id}`,
        { completed: !task.completed },
        { headers }
      );
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  // Update task
  const updateTask = async () => {
    if (!editText.trim()) return toast.error("Task cannot be empty");

    try {
      await axios.put(
        `${API}/${editTask._id}`,
        { text: editText },
        { headers }
      );
      setEditTask(null);
      setEditText("");
      fetchTasks();
      toast.success("Task updated");
    } catch (err) {
      console.log(err);
      toast.error("Update failed");
    }
  };

  // Filtering (SAFE)
  const filteredTasks = tasks
    .filter((t) =>
      (t.text || "").toLowerCase().includes(search.toLowerCase())
    )
    .filter((t) => {
      if (filter === "completed") return t.completed;
      if (filter === "pending") return !t.completed;
      return true;
    });

  const completed = tasks.filter((t) => t.completed).length;
  const total = tasks.length;
  const progress = total ? (completed / total) * 100 : 0;

  return (
    <div className={`container py-5 ${darkMode ? "bg-dark text-light" : ""}`}>
      
      {/* Header */}
      <div className="d-flex justify-content-between mb-4">
        <h2>🚀 Task Dashboard</h2>

        <button
          className="btn btn-outline-secondary"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      {/* Add Task */}
      <div className="card p-3 mb-4 shadow-sm border-0">
        <div className="d-flex gap-2 flex-wrap">
          <input
            className="form-control"
            placeholder="Enter task..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
          </select>

          <input
            type="date"
            className="form-control"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <button className="btn btn-primary" onClick={addTask}>
            Add Task
          </button>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="d-flex gap-2 mb-3">
        <input
          className="form-control"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="form-select w-auto"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <small>{completed}/{total} completed</small>
        <div className="progress">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Loading */}
      {loading && <p className="text-center">Loading tasks...</p>}

      {/* Empty State */}
      {!loading && filteredTasks.length === 0 && (
        <div className="text-center text-muted mt-5">
          <h5>No tasks found 😴</h5>
          <p>Create your first task to get started</p>
        </div>
      )}

      {/* Tasks */}
      <div className="row">
        {filteredTasks.map((task) => (
          <div className="col-md-4 mb-4" key={task._id}>
            <div className="card shadow-sm border-0 h-100 task-card">
              <div className="card-body d-flex flex-column justify-content-between">

                <div>
                  <h5 className={`fw-bold ${task.completed ? "text-decoration-line-through text-muted" : ""}`}>
                    {task.text || "No task"}
                  </h5>

                  <span className={`badge ${task.completed ? "bg-success" : "bg-warning text-dark"}`}>
                    {task.completed ? "Completed" : "Pending"}
                  </span>

                  <p className="mt-2 mb-1 text-muted small">
                    📂 {task.category || "General"}
                  </p>

                  <p className="text-muted small">
                    📅 {task.dueDate ? task.dueDate.slice(0, 10) : "No date"}
                  </p>
                </div>

                <div className="d-flex justify-content-between mt-3">
                  <div>
                    <button
                      className="btn btn-sm btn-light me-2"
                      onClick={() => {
                        setEditTask(task);
                        setEditText(task.text || "");
                      }}
                    >
                      ✏️
                    </button>

                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={() => toggleTask(task)}
                    >
                      ✔️
                    </button>
                  </div>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteTask(task._id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editTask && (
        <>
          <div className="modal show d-block">
            <div className="modal-dialog">
              <div className="modal-content p-3">
                <h5>Edit Task</h5>

                <input
                  className="form-control mb-3"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />

                <button className="btn btn-primary" onClick={updateTask}>
                  Save
                </button>
              </div>
            </div>
          </div>

          <div className="modal-backdrop show"></div>
        </>
      )}
    </div>
  );
}