const axios = require('axios');

const extractLanguage = (query) => {
  const queryLower = query.toLowerCase();
  
  if (queryLower.includes("in marathi")) return "marathi";
  if (queryLower.includes("in hindi")) return "hindi";
  if (queryLower.includes("in english")) return "english";
  
  // Check for Devanagari characters (Marathi/Hindi)
  if (/[\u0900-\u097F]/.test(query)) {
    // Basic heuristics for Marathi vs Hindi
    const marathiWords = ["काय", "म्हणजे", "कसा", "कुठे", "झाले"];
    const hindiWords = ["क्या", "कैसे", "क्यों", "कब", "हुआ"];
    
    if (marathiWords.some(word => query.includes(word))) return "marathi";
    if (hindiWords.some(word => query.includes(word))) return "hindi";
    
    return "marathi"; // Default to Marathi for Devanagari if unsure
  }
  
  // Transliterated words
  const marathiTrans = ["mhanje", "kay", "kasa", "kuthe"];
  const hindiTrans = ["kya", "kaise", "kyu", "kab"];
  
  if (marathiTrans.some(word => queryLower.includes(word))) return "marathi";
  if (hindiTrans.some(word => queryLower.includes(word))) return "hindi";
  
  return "english";
};

const cleanQuery = (query) => {
  return query.toLowerCase()
    .replace("in marathi", "")
    .replace("in hindi", "")
    .replace("in english", "")
    .trim();
};

const getPrompt = (question, language) => {
  return `
    You are a Q&A assistant for computer education.

    VERY IMPORTANT:
    Answer strictly in ${language}.
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
    ${question}

    Answer:
  `;
};

const cleanResponse = (text) => {
  return text.replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/#/g, "")
    .trim();
};

// @desc    Get AI Chat response
// @route   POST /api/chat
// @access  Private
const getChatResponse = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Please provide a message' });
    }

    const language = extractLanguage(message);
    const cleanedQuestion = cleanQuery(message);
    const prompt = getPrompt(cleanedQuestion, language);

    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: "openrouter/free",
      messages: [
        { role: "user", content: prompt }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://digimitra.org', // Optional, for OpenRouter tracking
        'X-Title': 'Digimitra'
      }
    });

    const aiMessage = response.data.choices[0].message.content;
    const finalAnswer = cleanResponse(aiMessage.split("Answer:").pop());

    res.json({ 
      answer: finalAnswer,
      language: language 
    });

  } catch (error) {
    console.error('Chat AI Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'AI service unavailable' });
  }
};

module.exports = { getChatResponse };
