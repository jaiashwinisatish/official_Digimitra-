import streamlit as st
from contentgen import generate_answer
from llm_helper import llm

st.title("DigiMitra: ")
st.subheader("Your Mitra 🤗 to make you Digitally Literate 💻")

question = st.text_input("Question: ")

if question:
    ans = generate_answer(question)
    final_answer = ans.split("Answer:")[-1].strip()

    st.header("Answer:")
    st.write(final_answer)