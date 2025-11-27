const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function getResponse(summary) {
  const chatCompletion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: summary,
      },
      {
        role: "system",
        content: `
               You are an expert reviewer who analyzes any summary or content I give and produces a structured, detailed, and clear evaluation.

Please follow this exact format while responding:

1. **Summary Understanding**
   - Briefly explain how you understood the given summary.
   - Highlight key points.

2. **Strengths**
   - Bullet points describing what is good.

3. **Weaknesses / Issues**
   - Bullet points describing areas that need improvement.

4. **Suggestions / Improvements**
   - Provide actionable and practical improvements.

5. **Detailed Review Fields**
   - Clarity: (Rating / Explanation)
   - Structure: (Rating / Explanation)
   - Logic: (Rating / Explanation)
   - Creativity: (Rating / Explanation)
   - Completeness: (Rating / Explanation)
   - Technical Accuracy: (Rating / Explanation)
   - Engagement: (Rating / Explanation)

6. **Rewritten Improved Version**
   - Rewrite the summary in a better, more polished way.

7. **Additional Notes (Optional)**
   - Add anything valuable that the writer should know.

IMPORTANT:
- Use clear headings.
- Use bullet points where necessary.
- Keep tone friendly and professional.

Now I will give you the summary. Please analyze it using the above structure.
                `,
      },
    ],
  });

  return chatCompletion.choices[0].message.content;
}

module.exports = getResponse;