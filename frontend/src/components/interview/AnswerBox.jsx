import { useState } from "react";

function AnswerBox({ saveAnswer, isLast = false, disabled = false }) {
  const [answer, setAnswer] = useState("");

  const handleNext = () => {
    if (answer.trim() === "") {
      alert("Please enter an answer before continuing.");
      return;
    }
    saveAnswer(answer);
    setAnswer("");
  };

  return (
    <div>
      <textarea
        rows="8"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer here…"
        disabled={disabled}
        className="w-full border rounded-lg p-4 focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      />

      <button
        onClick={handleNext}
        disabled={disabled}
        className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLast ? "Submit Interview ✓" : "Next Question →"}
      </button>
    </div>
  );
}

export default AnswerBox;