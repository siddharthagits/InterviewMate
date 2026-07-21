import unittest

from app.gemini_service import evaluate_answers


class GeminiServiceTests(unittest.TestCase):
    def test_fallback_evaluation_changes_with_answers(self):
        interview_data = {
            "role": "Software Engineer",
            "experience": "2 years",
            "language": "Python",
            "difficulty": "medium",
            "duration": "30 mins",
        }

        strong_answers = [
            "I led a Python service migration and improved reliability by 30%.",
            "I explain architecture trade-offs clearly and use examples from production work.",
        ]
        weak_answers = [
            "I do not know much about this role yet.",
            "I can only give short answers.",
        ]

        strong_result = evaluate_answers(interview_data, strong_answers)
        weak_result = evaluate_answers(interview_data, weak_answers)

        self.assertNotEqual(strong_result["score"], weak_result["score"])
        self.assertNotEqual(strong_result["feedback"], weak_result["feedback"])


if __name__ == "__main__":
    unittest.main()
