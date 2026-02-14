import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    const completion = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [
        {
          role: "system",
          content: "You are an expert full-stack developer. Output clean code only."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    })

    return Response.json({
      output: completion.choices[0].message.content
    })
  } catch (error) {
    return Response.json({ error: "AI failed" }, { status: 500 })
  }
}
