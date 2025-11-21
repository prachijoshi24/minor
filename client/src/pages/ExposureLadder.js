import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function ExposureLadder() {
  const [exposure, setExposure] = useState("");
  const [difficulty, setDifficulty] = useState(5);
  const [tasks, setTasks] = useState([]);

  // 🌸 Load saved exposures
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("exposureTasks")) || [];
    setTasks(savedTasks);
  }, []);

  // 💗 Save new task
  const handleAddTask = () => {
    if (!exposure.trim()) return;

    const newTask = {
      text: exposure,
      difficulty,
      done: false,
    };

    const updated = [newTask, ...tasks];
    setTasks(updated);
    localStorage.setItem("exposureTasks", JSON.stringify(updated));
    setExposure("");
    setDifficulty(5);
  };

  // ✅ Toggle task completion
  const toggleDone = (index) => {
    const updated = tasks.map((task, i) =>
      i === index ? { ...task, done: !task.done } : task
    );
    setTasks(updated);
    localStorage.setItem("exposureTasks", JSON.stringify(updated));
  };

  // 🩷 Delete task
  const deleteTask = (index) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
    localStorage.setItem("exposureTasks", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-pink-gradient flex flex-col items-center justify-center p-6 font-cute">
      <div className="bg-white/90 p-8 rounded-3xl shadow-softPink w-full max-w-3xl text-center">
        <h1 className="text-4xl font-bold text-deepRose mb-6">
          Exposure Ladder 🪜
        </h1>
        <p className="text-gray-700 mb-6">
          Face your fears gently 🌷 — start small, and celebrate every step 💖
        </p>

        {/* 🪜 Input area */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          <input
            type="text"
            placeholder="Add a fear or challenge..."
            value={exposure}
            onChange={(e) => setExposure(e.target.value)}
            className="w-full sm:w-2/3 border border-rose rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-rose font-sweet"
          />
          <div className="flex items-center space-x-2">
            <label className="text-gray-700 text-sm">Difficulty:</label>
            <input
              type="range"
              min="1"
              max="10"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="accent-rose"
            />
            <span className="text-deepRose font-bold">{difficulty}</span>
          </div>
          <button
            onClick={handleAddTask}
            className="bg-deepRose text-white px-6 py-2 rounded-full hover:bg-rose transition shadow-softPink font-semibold"
          >
            Add 💪
          </button>
        </div>

        {/* 📋 Task List */}
        {tasks.length === 0 ? (
          <p className="text-gray-600 italic mt-4">
            No steps yet — start building your ladder 🩷
          </p>
        ) : (
          <div className="mt-6 text-left max-h-[400px] overflow-y-auto space-y-3 pr-2">
            {tasks.map((task, i) => (
              <div
                key={i}
                className={`p-4 rounded-2xl shadow-softPink border ${
                  task.done
                    ? "bg-softPink/60 border-pinky line-through opacity-70"
                    : "bg-white/90 border-rose"
                } flex justify-between items-center transition`}
              >
                <div>
                  <p className="text-gray-800 font-sweet">{task.text}</p>
                  <p className="text-sm text-gray-500">
                    Difficulty: {task.difficulty}/10
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleDone(i)}
                    className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
                      task.done
                        ? "bg-gray-400 text-white"
                        : "bg-deepRose text-white hover:bg-rose"
                    }`}
                  >
                    {task.done ? "Undo" : "Done"}
                  </button>
                  <button
                    onClick={() => deleteTask(i)}
                    className="text-rose font-bold hover:text-deepRose transition"
                  >
                    ✖
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Link
        to="/"
        className="mt-6 text-deepRose underline hover:text-rose text-shadow-soft"
      >
        ← Back to Home
      </Link>
    </div>
  );
}

export default ExposureLadder;
