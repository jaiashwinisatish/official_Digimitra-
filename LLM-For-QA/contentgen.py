from llm_helper import llm
import re


def extract_language(query):
    query_lower = query.lower()

    if "in marathi" in query_lower:
        return "marathi"

    elif "in hindi" in query_lower:
        return "hindi"

    elif "in english" in query_lower:
        return "english"

    elif re.search(r"[\u0900-\u097F]", query):

        if any(word in query for word in ["काय", "म्हणजे", "कसा", "कुठे"]):
            return "marathi"

        if any(word in query for word in ["क्या", "कैसे", "क्यों", "कब"]):
            return "hindi"

        return "marathi"

    elif any(word in query_lower for word in ["mhanje", "kay", "kasa", "kuthe"]):
        return "marathi"

    elif any(word in query_lower for word in ["kya", "kaise", "kyu", "kab"]):
        return "hindi"

    return "english"


def clean_query(query):
    query_lower = query.lower()

    query_lower = query_lower.replace("in marathi", "")
    query_lower = query_lower.replace("in hindi", "")
    query_lower = query_lower.replace("in english", "")

    return query_lower.strip()


def get_prompt(language, query):
    return f"""
You are DigiMitra AI, a domain-specific computer education assistant for students.

Answer the following computer-related question in {language}.

QUESTION:
{query}

STRICT RESPONSE RULES:

1. Give a short, clear and student-friendly answer.
2. Do NOT write one long paragraph.
3. Use short paragraphs and bullet points where appropriate.
4. Start directly with the answer. Do not add unnecessary introductions.
5. Explain technical terms in simple language.
6. Give an example only when it helps understanding.
7. Keep the answer concise, preferably under 120 words.
8. Do not repeat the question unnecessarily.
9. Do not add information unrelated to the question.
10. Use proper spacing and readable formatting.
11. Answer ONLY computer/technology-related questions.
12. If the question is not computer-related, politely say that DigiMitra only answers computer-related questions and don't throw an error.
13. If user says Hi, hello, good morning, good afternoon, good evening, etc. give the greetings in the same language as the question and ask how can I help you? only.

FORMAT:
- Short definition/explanation
- 2–5 key points if useful
- One simple example if useful

Example:
RAM म्हणजे काय?
RAM (Random Access Memory) ही संगणकाची तात्पुरती मेमरी आहे.

मुख्य वैशिष्ट्ये:
• संगणक चालू असताना डेटा साठवते
• संगणक बंद केल्यावर डेटा नष्ट होतो
• CPU ला डेटा पटकन उपलब्ध करून देते

उदाहरण:
तुम्ही एखादे Word document उघडता तेव्हा ते RAM मध्ये तात्पुरते लोड होते.

Follow the given rules strictly.
Return ONLY the final answer.
"""

def clean_response(text):
    text = text.replace("**", "")
    text = text.replace("*", "")
    text = text.replace("#", "")
    return text.strip()


def generate_answer(question):

    language = extract_language(question)

    if not language:
        language = "english"

    cleaned_question = clean_query(question)

    prompt = get_prompt(language, cleaned_question)

    response = llm.invoke(prompt)
    cleaned_output = clean_response(response.content)

    return cleaned_output


if __name__ == "__main__":
    post = generate_answer("What is the brain of the computer? in english")
    print(post)
