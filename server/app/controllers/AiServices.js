const Groq = require("groq-sdk");

// Use an empty string fallback as per environment requirements
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

/**
 * Analysis of errors found in your original snippet:
 * 1. Role Confusion: You passed the 'summary' as a SYSTEM message. Models often 
 * ignore data in system messages or get confused between instructions and input.
 * 2. Message Order: You provided the summary before the instructions.
 * 3. Lack of Retries: API calls can fail due to rate limits (429) or timeouts.
 * 4. Missing Error Handling: No try/catch block to prevent app crashes.
 */

async function getResponse(summary) {
  const systemPrompt = `You are an expert reviewer who analyzes any summary or content I give and produces a structured, detailed, and clear evaluation.

Please follow this exact format while responding:
1. **Summary Understanding**
2. **Strengths**
3. **Weaknesses / Issues**
4. **Suggestions / Improvements**
5. **Detailed Review Fields** (Clarity, Structure, Logic, Creativity, Completeness, Technical Accuracy, Engagement)
6. **Rewritten Improved Version**
7. **Additional Notes (Optional)**`;

  const userContent = `Here is the summary to analyze:\n\n${summary}`;

  // Exponential Backoff Implementation (Required for stability)
  let delay = 1000;
  for (let i = 0; i < 5; i++) {
    try {
      const chatCompletion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user", // FIX: Changed from 'system' to 'user'
            content: userContent,
          },
        ],
      });

      return chatCompletion.choices[0]?.message?.content || "No response content.";
    } catch (error) {
      // If we've reached the last attempt, throw a user-friendly error
      if (i === 4) {
        return "The review service is currently unavailable. Please try again later.";
      }
      
      // Wait for 1s, 2s, 4s, 8s, 16s
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
}

module.exports = getResponse;