function QuestionCard({ question, number }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-2xl font-bold mb-4">
        Question {number}
      </h2>

      <p className="text-lg">
        {question}
      </p>

    </div>
  );
}

export default QuestionCard;