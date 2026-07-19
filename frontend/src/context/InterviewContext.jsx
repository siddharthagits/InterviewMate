import { createContext, useContext, useState } from "react";

const InterviewContext = createContext();

export function InterviewProvider({ children }) {
  const [interviewData, setInterviewData] = useState({
    role: "",
    experience: "",
    language: "",
    difficulty: "",
    duration: "",
    answers: [],
  });

  return (
    <InterviewContext.Provider
      value={{
        interviewData,
        setInterviewData,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterview() {
  return useContext(InterviewContext);
}