// lib/agent.ts

export type AgentResponse = {
  phase: "question" | "planning" | "generating" | "complete"
  message: string
  files?: {
    filename: string
    content: string
  }[]
  estimated_time: number
}

export async function runAgent(messages: any[]): Promise<AgentResponse> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama3-70b-8192",  // safer model
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `
You are an autonomous AI software architect.

Always respond in STRICT JSON format:

{
  "phase": "question" | "planning" | "generating" | "complete",
  "message": "assistant message",
  "estimated_time": number,
  "files": [
    {
      "filename": "string",
      "content": "string"
    }
  ]
}

If not generating, do not include files.
          `
        },
        ...messages
      ],
    }),
  })

  const data = await response.json()

  console.log("Groq raw response:", JSON.stringify(data))

  if (!data.choices) {
    throw new Error(JSON.stringify(data))
  }

  const content = data.choices[0].message.content

  try {
    return JSON.parse(content)
  } catch {
    throw new Error("Model returned invalid JSON")
  }
}
