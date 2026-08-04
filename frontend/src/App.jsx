import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import InterviewSetup from "./pages/InterviewSetup";
import Interview from "./pages/Interview";
import Results from "./pages/Results";
import History from "./pages/History";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import MockTestPage from "./pages/MockTestPage";
import MockTestList from "./pages/MockTestList";
import CompanyAssessment from "./pages/CompanyAssessment";
import CompanyExamTest from "./pages/CompanyExamTest";
import QuestionBank from "./pages/QuestionBank";
import SubjectTest from "./pages/SubjectTest";
import VoiceLanding from "./pages/VoiceLanding";
import VoiceSetup from "./pages/VoiceSetup";
import VoiceInterview from "./pages/VoiceInterview";
import VoiceResults from "./pages/VoiceResults";
import TypingTest from "./pages/TypingTest";

function App() {
  return (
    <Routes>
      <Route path="/"                       element={<Home />} />
      <Route path="/login"                  element={<Login />} />
      <Route path="/register"               element={<Register />} />
      <Route path="/dashboard"              element={<Dashboard />} />
      <Route path="/setup"                  element={<InterviewSetup />} />
      <Route path="/interview"              element={<Interview />} />
      <Route path="/results"                element={<Results />} />
      <Route path="/history"                element={<History />} />
      <Route path="/reports"                element={<Reports />} />
      <Route path="/profile"                element={<Profile />} />
      <Route path="/mock-test/:category"    element={<MockTestPage />} />
      <Route path="/mock-tests"             element={<MockTestList />} />
      <Route path="/company-assessment"            element={<CompanyAssessment />} />
      <Route path="/company-assessment/:companyId" element={<CompanyExamTest />} />
      <Route path="/question-bank"                 element={<QuestionBank />} />
      <Route path="/question-bank/:subject"        element={<SubjectTest />} />
      <Route path="/voice"                         element={<VoiceLanding />} />
      <Route path="/voice/setup"                   element={<VoiceSetup />} />
      <Route path="/voice-interview"               element={<VoiceInterview />} />
      <Route path="/voice-results"                 element={<VoiceResults />} />
      <Route path="/typing-test"                   element={<TypingTest />} />
    </Routes>
  );
}

export default App;
