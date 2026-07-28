import { createContext, useContext, useState } from "react";

const InterviewContext = createContext();

export function InterviewProvider({ children }) {
  const [interviewData, setInterviewData] = useState({
    role: "",
    experience: "",
    language: "",
    difficulty: "",
    duration: "",
    company: "",          // NEW — company-specific mode
    pressureMode: false,  // NEW — per-question timer
    answers: [],
  });

  const [result,      setResult]      = useState(null);
  const [questions,   setQuestions]   = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [sessionHistory, setSessionHistory] = useState([]); // NEW — track sessions

  // NEW — add completed session to history
  const saveToHistory = (session) => {
    setSessionHistory(prev => [session, ...prev].slice(0, 10)); // keep last 10
  };

  return (
    <InterviewContext.Provider value={{
      interviewData, setInterviewData,
      result,        setResult,
      questions,     setQuestions,
      userAnswers,   setUserAnswers,
      sessionHistory, saveToHistory,
    }}>
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterview() { return useContext(InterviewContext); }