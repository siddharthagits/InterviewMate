import { Link } from "react-router-dom";

function Results() {
  // Temporary dummy data
  const result = {
    score: 85,
    totalQuestions: 5,
    answered: 5,
    performance: "Excellent",
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-2xl">

        <h1 className="text-4xl font-bold text-center text-blue-600">
          Interview Results
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Your interview has been completed successfully.
        </p>

        <div className="mt-8 space-y-5">

          <div className="flex justify-between text-lg border-b pb-2">
            <span>Score</span>
            <span className="font-semibold">
              {result.score}/100
            </span>
          </div>

          <div className="flex justify-between text-lg border-b pb-2">
            <span>Total Questions</span>
            <span>{result.totalQuestions}</span>
          </div>

          <div className="flex justify-between text-lg border-b pb-2">
            <span>Answered</span>
            <span>{result.answered}</span>
          </div>

          <div className="flex justify-between text-lg">
            <span>Performance</span>

            <span className="font-bold text-green-600">
              {result.performance}
            </span>
          </div>

        </div>

        <div className="mt-10 flex justify-center">

          <Link
            to="/dashboard"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </Link>

        </div>

      </div>
    </div>
  );
}

export default Results;