import Groq from "groq-sdk"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!process.env.GROQ_API_KEY) {
      return Response.json(
        { error: "Missing GROQ_API_KEY" },
        { status: 500 }
      )
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are AppBuilderAI — an interactive AI SaaS engineer.

You behave like a real assistant:
- Friendly
- Confident
- Asks clarifying questions when needed
- Helps the user refine their app idea

You must respond in STRICT JSON format only.

Response format:

{
  "type": "question" | "code" | "chat",
  "message": "text response",
  "options": ["option1", "option2"] (only if type = question),
  "code": "React code here only if type = code"
}

Rules:

If the user request is vague:
→ Ask a clarifying question.
→ type = "question"
→ Provide 2–5 checkbox-style options.

If the user confirms details:
→ Generate full React app.
→ type = "code"
→ Code must:
   - Start with "use client"
   - Be complete app/page.tsx
   - Use Tailwind
   - Use glassmorphism
   - Use gradient background
   - Modern UI
   - Fully working

If user is chatting:
→ type = "chat"
→ Respond conversationally.

Never return markdown.
Never return backticks.
Only valid JSON.
`
        },
        ...messages
      ],
      temperature: 0.6,
    })

    const content = completion.choices[0]?.message?.content

    // Try parsing JSON safely
    let parsed

    try {
      parsed = JSON.parse(content || "{}")
    } catch {
      parsed = {
        type: "chat",
        message: content || "Something went wrong."
      }
    }

    return Response.json(parsed)

  } catch (error: any) {
    return Response.json(
      { error: error.message || "Server error" },
      { status: 500 }
    )
  }
}
