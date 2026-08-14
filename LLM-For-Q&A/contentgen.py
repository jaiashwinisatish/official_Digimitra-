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

    elif re.search(r'[\u0900-\u097F]', query):

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

def get_prompt(question, language):
    return f'''
    You are a Q&A assistant for computer education.

    VERY IMPORTANT:
    Answer strictly in {language}.
    If the question is asked in Marathi, reply only in Marathi.
    If the question is asked in Hindi, reply only in Hindi.
    Do not translate to English unless asked.
    Do NOT use symbols like **, *, #, or markdown formatting.

    Format rules:
    - explain the topic in few lines of paragraph
    - Use simple bullet points wherever needed
    - Use plain text only
    - Keep language easy for students

    Example format:
    - Explanation
    - Points wherever needed
    - Example: simple explanation

    Question:
    {question}

    Answer:
    '''

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

    prompt = get_prompt(cleaned_question, language)

    response = llm.invoke(prompt)
    cleaned_output = clean_response(response.content)

    return cleaned_output


if __name__ == '__main__':
    post = generate_answer("What is the brain of the computer? in english")
    print(post)
