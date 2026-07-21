import { createContext, useContext, useState } from "react";

const InterviewContext = createContext();

export function InterviewProvider({ children }) {
  const [interviewData, setInterviewData] = useState({
    role: "", experience: "", language: "", difficulty: "", duration: "", answers: [],
  });
  const [result, setResult]       = useState(null);
  const [questions, setQuestions] = useState([]);   // full question list after interview
  const [userAnswers, setUserAnswers] = useState([]); // submitted answers

  return (
    <InterviewContext.Provider value={{
      interviewData, setInterviewData,
      result, setResult,
      questions, setQuestions,
      userAnswers, setUserAnswers,
    }}>
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterview() { return useContext(InterviewContext); }