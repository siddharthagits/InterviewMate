import { useState } from "react";
import questions from "../data/questions";

import QuestionCard from "../components/interview/QuestionCard";
import AnswerBox from "../components/interview/AnswerBox";
import ProgressBar from "../components/interview/ProgressBar";
import Timer from "../components/interview/Timer";

function Interview() {
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      alert("Interview Completed!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-10">

      <ProgressBar
        current={currentQuestion + 1}
        total={questions.length}
      />

      <Timer />

      <QuestionCard
        question={questions[currentQuestion].question}
      />

      <AnswerBox />

      <button
        onClick={nextQuestion}
        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg"
      >
        Next Question
      </button>

    </div>
  );
}

export default Interview;