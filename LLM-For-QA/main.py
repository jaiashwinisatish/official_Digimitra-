from flask import Flask, request, jsonify
from flask_cors import CORS

from contentgen import generate_answer

app = Flask(__name__)
CORS(app)


@app.route("/ask", methods=["POST"])
def ask_question():
    try:
        data = request.get_json()

        if not data or "question" not in data:
            return jsonify({"error": "Question is required"}), 400

        question = data["question"].strip()

        if not question:
            return jsonify({"error": "Question cannot be empty"}), 400

        answer = generate_answer(question)

        return jsonify({"question": question, "answer": answer})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "DigiMitra Q&A API is running"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
