import json
import re
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.exceptions import OutputParserException
from llm_helper import llm


def clean_text(text):
    if not isinstance(text, str):
        return ""

    text = re.sub(r'[\ud800-\udfff]', '', text)
    text = text.encode("utf-8", "ignore").decode("utf-8")

    return text.strip()


def process_posts(raw_file_path, processed_file_path="data/processed_posts.json"):
    enriched_posts = []

    with open(raw_file_path, encoding='utf-8') as file:
        posts = json.load(file)

        for post in posts:
            raw_text = post.get('text', '')

            # Step 1: Extract usable content
            parsed_text = extract_llm_content(raw_text)

            # Step 2: Clean
            clean_post = clean_text(parsed_text)

            # Step 3: Convert into structured learning format
            structured_output = generate_learning_content(clean_post)

            enriched_posts.append(structured_output)

    # Save output
    with open(processed_file_path, encoding='utf-8', mode="w") as outfile:
        json.dump(enriched_posts, outfile, indent=4, ensure_ascii=False)

def generate_learning_content(text):
    template = """
    Convert the following content into a simple educational format for students.

    Rules:
    - Answer only to the computer related topics
    - Keep language simple
    - Make it easy for beginners
    - Output must be JSON only
    - Detect language and respond in same language

    Format:
    {{
        "question": "...",
        "answer": "...",
        "example": "..."
    }}

    Content:
    {text}
    """

    pt = PromptTemplate.from_template(template)
    chain = pt | llm

    response = chain.invoke({"text": text})

    try:
        parser = JsonOutputParser()
        return parser.parse(response.content)
    except OutputParserException:
        return {
            "question": "Explain this topic",
            "answer": text,
            "example": ""
        }

def extract_llm_content(text):
    try:
        data = json.loads(text)
        if isinstance(data, dict):
            return data.get("content", text)
        return text
    except json.JSONDecodeError:
        return text.strip()

if __name__ == "__main__":
    process_posts("data/raw_posts.json", "data/processed_posts.json")
