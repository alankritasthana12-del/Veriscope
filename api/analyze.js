export default async function handler(req, res) {
  try {
    const { text, mode } = req.body;

    const prompt = `
You are VeriScope.

Analyze the following ${mode} content and return ONLY valid JSON:

{
  "truth_score": 0-100,
  "bias_level": "Neutral | Slight | Strong | Extreme",
  "manipulation": ["tag1","tag2","tag3"],
  "explanation": "plain English explanation"
}

Text:
${text}
`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.GROQ_API_KEY
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2
      })
    });

    const data = await response.json();

    if (!data.choices) {
      return res.status(500).json({ error: "Groq error", data });
    }

    const content = data.choices[0].message.content;

    const start = content.indexOf("{");
    const end = content.lastIndexOf("}");

    if (start === -1 || end === -1) {
      return res.status(500).json({ error: "Model returned non-JSON", content });
    }

    const parsed = JSON.parse(content.slice(start, end + 1));

    res.status(200).json(parsed);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


