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
      model: "llama-3.1-70b-versatile",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `
You are an autonomous AI software architect.

Rules:
- Ask clarifying questions if user request is vague.
- If enough details exist, move to planning.
- After planning, generate structured files.
- Always respond ONLY in JSON format.

JSON FORMAT:

{
  "phase": "question" | "planning" | "generating" | "complete",
  "message": "assistant conversational message",
  "estimated_time": number_in_seconds,
  "files": [
    {
      "filename": "string",
      "content": "string"
    }
  ]
}

If not generating yet, do not include files.
          `
        },
        ...messages
      ],
    }),
  })

  const data = await response.json()

  const content = data.choices?.[0]?.message?.content

  if (!content) {
    throw new Error("No response from Groq")
  }

  try {
    return JSON.parse(content)
  } catch (err) {
    console.error("Invalid JSON from model:", content)
    throw new Error("Model did not return valid JSON")
  }
}
