import { useState } from "react";

function AnswerBox({ saveAnswer }) {
  const [answer, setAnswer] = useState("");

  const handleNext = () => {
    if (answer.trim() === "") {
      alert("Please enter an answer.");
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
        placeholder="Type your answer here..."
        className="w-full border rounded-lg p-4"
      />

      <button
        onClick={handleNext}
        className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Next Question →
      </button>
    </div>
  );
}

export default AnswerBox;