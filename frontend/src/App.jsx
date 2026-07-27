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
<<<<<<< HEAD
=======
import MockTestPage from "./pages/MockTestPage";
import MockTestList from "./pages/MockTestList";
>>>>>>> cb25cce (Initial commit)

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/setup" element={<InterviewSetup />} />
      <Route path="/interview" element={<Interview />} />
      <Route path="/results" element={<Results />} />
      <Route path="/history" element={<History />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/profile" element={<Profile />} />
<<<<<<< HEAD
=======
      <Route path="/mock-test/:category" element={<MockTestPage />} />
      <Route path="/mock-tests" element={<MockTestList />} />
>>>>>>> cb25cce (Initial commit)
    </Routes>
  );
}

export default App;