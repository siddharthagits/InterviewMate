import { useState } from "react";

function Interview() {
  const questions = [
    "Tell me about yourself.",
    "What are your strengths?",
    "Why should we hire you?",
    "Explain the difference between HTTP and HTTPS.",
    "Describe a challenging project you've worked on."
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswer("");
    } else {
      alert("Interview Completed!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-8">

        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            AI Mock Interview
          </h1>

          <span className="text-blue-600 font-semibold">
            Question {currentQuestion + 1} / {questions.length}
          </span>
        </div>

        <div className="mt-10">

          <h2 className="text-2xl font-semibold">
            {questions[currentQuestion]}
          </h2>

          <textarea
            rows="8"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full border rounded-lg mt-6 p-4"
          />

          <div className="flex justify-end mt-6">
            <button
              onClick={nextQuestion}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              {currentQuestion === questions.length - 1
                ? "Finish Interview"
                : "Next Question"}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Interview;