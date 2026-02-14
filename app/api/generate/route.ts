// app/api/generate/route.ts

import { runAgent } from "../../../lib/agent"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const messages = body.messages || []

    const result = await runAgent(messages)

    return new Response(
      JSON.stringify({
        success: true,
        phase: result.phase,
        message: result.message,
        estimated_time: result.estimated_time,
        files: result.files || []
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Something went wrong"
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
  }
}
