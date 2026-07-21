import json, os
from dotenv import load_dotenv
from google import genai
load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

prompt_easy = """Generate exactly 35 interview questions for:
Role: Frontend Developer, Experience: 1-2 Years, Language: JavaScript, Difficulty: Easy
Return ONLY a JSON array with exactly 25 mcq, 5 text, 5 code. Questions must match Easy difficulty."""

prompt_hard = """Generate exactly 35 interview questions for:
Role: Frontend Developer, Experience: 1-2 Years, Language: JavaScript, Difficulty: Hard
Return ONLY a JSON array with exactly 25 mcq, 5 text, 5 code. Questions must match Hard difficulty."""

print("Testing Easy...")
resp = client.models.generate_content(model="gemini-2.5-flash", contents=prompt_easy)
text = resp.text.strip().replace("```json","").replace("```","").strip()
try:
    parsed = json.loads(text)
    print("Easy first 2 MCQs:", [q['question'] for q in parsed if q['type']=='mcq'][:2])
except Exception as e:
    print("Error Easy:", e, repr(text[:100]))

print("Testing Hard...")
resp = client.models.generate_content(model="gemini-2.5-flash", contents=prompt_hard)
text = resp.text.strip().replace("```json","").replace("```","").strip()
try:
    parsed = json.loads(text)
    print("Hard first 2 MCQs:", [q['question'] for q in parsed if q['type']=='mcq'][:2])
except Exception as e:
    print("Error Hard:", e)

