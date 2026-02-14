import Groq from "groq-sdk"

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

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
You are a senior React + Next.js App Router engineer building production-ready SaaS applications.

STRICT RULES:

- Always return a complete app/page.tsx file.
- Use React functional components only.
- Use Tailwind CSS for styling.
- No separate HTML files.
- No CSS files.
- No explanations.
- No markdown.
- No backticks.
- Return only raw TypeScript React code.
- The response must start with: "use client"
- The UI must be modern, clean, responsive, and visually appealing.
- Use proper spacing, rounded corners, shadows, and gradients where appropriate.
- All apps must be fully working.
`
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
    })

    return Response.json({
      output: completion.choices[0]?.message?.content || "",
    })
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Server error" },
      { status: 500 }
    )
  }
}
