function QuestionCard({ question }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6">
      <h2 className="text-2xl font-bold mb-3">
        Interview Question
      </h2>

      <p className="text-lg">
        {question}
      </p>
    </div>
  );
}

export default QuestionCard;