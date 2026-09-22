import os
from dotenv import load_dotenv

load_dotenv()
from langchain_groq import ChatGroq
from langchain_openrouter import ChatOpenRouter

llm = ChatOpenRouter(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    model="nvidia/nemotron-3-ultra-550b-a55b:free",
)

# llm = ChatGroq(
#     api_key=os.getenv("GROQ_API_KEY"),
#     model="qwen/qwen3.8-27b",
# )

if __name__ == "__main__":
    question = input("What is the question? ")
    response = llm.invoke(question)
    print(response.content)
