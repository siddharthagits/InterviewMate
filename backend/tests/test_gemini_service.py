import json
import unittest
from unittest.mock import patch

from fastapi import HTTPException
from app.gemini_service import (
    VoiceEvaluationUnavailable,
    evaluate_answers,
    evaluate_voice_answers,
)
from app.routes.interview import evaluate_voice, explain
from app.schemas.interview import AnswerSubmission, EvaluationRequest, ExplainRequest


class GeminiServiceTests(unittest.TestCase):
    def test_explanation_service_failures_are_retryable_http_errors(self):
        request = ExplainRequest(question="What is caching?", subject="Computer Science")
        failure = "Failed to generate explanation. Gemini Error: 503 UNAVAILABLE"

        with patch("app.gemini_service.explain_question", return_value=failure):
            with self.assertRaises(HTTPException) as raised:
                explain(request)

        self.assertEqual(raised.exception.status_code, 503)

    def test_successful_explanation_is_returned(self):
        request = ExplainRequest(question="What is caching?", subject="Computer Science")
        expected = "Caching stores frequently accessed data for faster retrieval."

        with patch("app.gemini_service.explain_question", return_value=expected):
            self.assertEqual(explain(request), {"explanation": expected})

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

    def test_voice_evaluation_does_not_score_a_session_with_no_spoken_answers(self):
        answers = [
            AnswerSubmission(
                question_id=1,
                question_type="text",
                text="",
                question_text="Tell me about yourself.",
            )
        ]

        result = evaluate_voice_answers({"role": "Software Engineer"}, answers)

        self.assertEqual(result["evaluation_status"], "not_evaluated")
        self.assertIsNone(result["score"])
        self.assertEqual(result["per_question_feedback"][0]["verdict"], "Skipped")

    def test_voice_evaluation_returns_specific_coaching_and_excludes_skips(self):
        answers = [
            AnswerSubmission(
                question_id=1,
                question_type="text",
                text="I built an API.",
                question_text="Describe a project you built.",
            ),
            AnswerSubmission(
                question_id=2,
                question_type="text",
                text="",
                question_text="How do you handle a production incident?",
            ),
        ]
        ai_report = {
            "feedback": "Your project example is relevant but needs your actions and its result.",
            "strengths": ["You answered the project question directly."],
            "improvements": ["Explain your specific contribution and the outcome."],
            "dimensions": {"clarity": 70, "relevance": 80, "structure": 60},
            "per_question_feedback": [{
                "question_id": 1,
                "clarity": 70,
                "relevance": 80,
                "structure": 60,
                "issue": "The answer does not explain your role or the impact.",
                "what_worked": "You named the project work.",
                "suggested_answer": "I built [project] by [your action], which resulted in [measurable result].",
                "missed_points": ["Your individual contribution", "Outcome"],
            }],
        }

        with patch("app.gemini_service.client", object()), patch(
            "app.gemini_service._call_gemini",
            return_value=(json.dumps(ai_report), ""),
        ):
            result = evaluate_voice_answers({"role": "Software Engineer"}, answers)

        self.assertEqual(result["evaluation_status"], "evaluated")
        self.assertEqual(result["score"], 70)
        self.assertEqual(result["per_question_feedback"][0]["issue"], ai_report["per_question_feedback"][0]["issue"])
        self.assertIn("[measurable result]", result["per_question_feedback"][0]["suggested_answer"])
        self.assertEqual(result["per_question_feedback"][1]["verdict"], "Skipped")

    def test_voice_endpoint_surfaces_ai_evaluation_failures(self):
        request = EvaluationRequest(
            interview_data={"role": "Software Engineer"},
            answers=[
                AnswerSubmission(
                    question_id=1,
                    question_type="text",
                    text="I built an API.",
                    question_text="Describe a project you built.",
                )
            ],
        )
        with patch(
            "app.routes.interview.evaluate_voice_answers",
            side_effect=VoiceEvaluationUnavailable("AI unavailable"),
        ):
            with self.assertRaises(HTTPException) as raised:
                evaluate_voice(request)

        self.assertEqual(raised.exception.status_code, 503)
        self.assertEqual(raised.exception.detail, "AI unavailable")


if __name__ == "__main__":
    unittest.main()
