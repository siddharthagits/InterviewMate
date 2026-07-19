import { useState } from "react";

function AnswerBox() {
  const [answer, setAnswer] = useState("");

  return (
    <div className="mt-6">

      <textarea
        rows="8"
        placeholder="Write your answer..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="w-full border rounded-lg p-4"
      />

    </div>
  );
}

export default AnswerBox;