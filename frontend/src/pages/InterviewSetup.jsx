import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInterview } from "../context/InterviewContext";
function InterviewSetup() {
  const navigate = useNavigate();
  const { setInterviewData } = useInterview();
  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    language: "",
    difficulty: "",
    duration: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleStart = (e) => {
  e.preventDefault();

  setInterviewData((prev) => ({
    ...prev,
    ...formData,
  }));

  navigate("/interview");
};

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center px-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-xl p-8">

        <h1 className="text-3xl font-bold text-center text-slate-800">
          Start AI Interview
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Configure your interview
        </p>

        <form onSubmit={handleStart} className="space-y-5 mt-8">

          <div>
            <label className="font-medium">Job Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-1"
              required
            >
              <option value="">Select Role</option>
              <option>Software Engineer</option>
              <option>Frontend Developer</option>
              <option>Backend Developer</option>
              <option>Full Stack Developer</option>
              <option>Data Analyst</option>
            </select>
          </div>

          <div>
            <label className="font-medium">Experience</label>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-1"
              required
            >
              <option value="">Select Experience</option>
              <option>Fresher</option>
              <option>1-2 Years</option>
              <option>3-5 Years</option>
              <option>5+ Years</option>
            </select>
          </div>

          <div>
            <label className="font-medium">Programming Language</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-1"
              required
            >
              <option value="">Select Language</option>
              <option>Java</option>
              <option>Python</option>
              <option>C++</option>
              <option>JavaScript</option>
            </select>
          </div>

          <div>
            <label className="font-medium">Difficulty</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-1"
              required
            >
              <option value="">Select Difficulty</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          <div>
            <label className="font-medium">Duration</label>
            <select
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-1"
              required
            >
              <option value="">Select Duration</option>
              <option>10 Minutes</option>
              <option>15 Minutes</option>
              <option>30 Minutes</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Start Interview
          </button>

        </form>

      </div>
    </div>
  );
}

export default InterviewSetup;