import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function MoodTracker() {
  const moods = [
    { emoji: "🥰", label: "Amazing" },
    { emoji: "😊", label: "Good" },
    { emoji: "😐", label: "Okay" },
    { emoji: "😔", label: "Sad" },
    { emoji: "😭", label: "Rough Day" },
  ];

  const [selectedMood, setSelectedMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);

  // Load saved moods
  useEffect(() => {
    const storedMoods = JSON.parse(localStorage.getItem("moodHistory")) || [];
    setMoodHistory(storedMoods);
  }, []);

  // Save mood
  const handleSaveMood = () => {
    if (!selectedMood) return;

    const today = new Date();
    const date = today.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const newMood = { mood: selectedMood, date };
    const updated = [newMood, ...moodHistory];

    setMoodHistory(updated);
    localStorage.setItem("moodHistory", JSON.stringify(updated));
    setSelectedMood(null);
  };

  // Delete mood
  const handleDelete = (index) => {
    const updated = moodHistory.filter((_, i) => i !== index);
    setMoodHistory(updated);
    localStorage.setItem("moodHistory", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-pink-gradient flex flex-col items-center justify-center p-6 font-cute">
      <div className="bg-white/90 p-8 rounded-3xl shadow-softPink w-full max-w-3xl text-center">
        <h1 className="text-4xl font-bold text-deepRose mb-6">
          Mood Tracker 🎀
        </h1>

        <p className="text-gray-700 mb-6">
          How are you feeling today, cutie? 🌸
        </p>

        {/* Mood Selection */}
        <div className="flex justify-center gap-6 mb-6 flex-wrap">
          {moods.map((m) => (
            <button
              key={m.label}
              onClick={() => setSelectedMood(m.label)}
              className={`text-5xl transition transform hover:scale-125 ${
                selectedMood === m.label ? "scale-125" : ""
              }`}
              title={m.label}
            >
              {m.emoji}
            </button>
          ))}
        </div>

        <button
          onClick={handleSaveMood}
          disabled={!selectedMood}
          className={`mt-4 px-6 py-3 rounded-full text-white font-semibold shadow-softPink transition ${
            selectedMood
              ? "bg-deepRose hover:bg-rose"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {selectedMood ? `Save as "${selectedMood}" 💖` : "Select a Mood 🌷"}
        </button>

        {/* Mood History */}
        {moodHistory.length > 0 ? (
          <div className="mt-10 text-left">
            <h2 className="text-2xl font-semibold text-deepRose mb-4">
              Your Mood History 💕
            </h2>
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
              {moodHistory.map((entry, index) => (
                <div
                  key={index}
                  className="bg-softPink/70 border border-pinky rounded-2xl p-4 shadow-softPink flex justify-between items-center"
                >
                  <div className="text-lg">
                    <span className="text-2xl mr-2">
                      {moods.find((m) => m.label === entry.mood)?.emoji}
                    </span>
                    {entry.mood} <br />
                    <span className="text-sm text-gray-500">{entry.date}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-rose font-bold hover:text-deepRose transition"
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 italic mt-8">
            No moods logged yet. Start tracking today 💗
          </p>
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

export default MoodTracker;
