import { useState } from "react";
import { useNavigate } from "react-router-dom";
import questions from "../data/questions";
import { useInterview } from "../context/InterviewContext";

import QuestionCard from "../components/interview/QuestionCard";
import Timer from "../components/interview/Timer";
import ProgressBar from "../components/interview/ProgressBar";
import AnswerBox from "../components/interview/AnswerBox";

function Interview() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);

  const { interviewData } = useInterview();
  const navigate = useNavigate();

  const saveAnswer = (answer) => {
    const updatedAnswers = [...answers, answer];
    setAnswers(updatedAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      console.log("Interview Finished");
      console.log(updatedAnswers);

      navigate("/results");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            AI Mock Interview
          </h1>

          <Timer />
        </div>

        {/* Interview Details */}
        <div className="bg-white shadow rounded-lg p-5 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Interview Details
          </h2>

          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <p>
              <strong>Role:</strong> {interviewData.role}
            </p>

            <p>
              <strong>Experience:</strong> {interviewData.experience}
            </p>

            <p>
              <strong>Language:</strong> {interviewData.language}
            </p>

            <p>
              <strong>Difficulty:</strong> {interviewData.difficulty}
            </p>

            <p>
              <strong>Duration:</strong> {interviewData.duration}
            </p>
          </div>
        </div>

        {/* Progress */}
        <ProgressBar
          current={currentQuestion + 1}
          total={questions.length}
        />

        {/* Question */}
        <div className="mt-8">
          <QuestionCard
            number={currentQuestion + 1}
            question={questions[currentQuestion].question}
          />
        </div>

        {/* Answer */}
        <div className="mt-8">
          <AnswerBox saveAnswer={saveAnswer} />
        </div>

      </div>
    </div>
  );
}

export default Interview;