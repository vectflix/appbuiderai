"use client"

import { useState } from "react"

export default function Dashboard() {
  const [prompt, setPrompt] = useState("")
  const [code, setCode] = useState("// AI output will appear here")
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    if (!prompt) return

    setLoading(true)

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt })
      })

      const data = await res.json()

      if (data.output) {
        setCode(data.output)
      } else {
        setCode("ERROR: " + JSON.stringify(data))
      }
    } catch (err: any) {
      setCode("FETCH ERROR: " + err.message)
    }

    setLoading(false)
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#0a0a0a",
        color: "white"
      }}
    >
      <div
        style={{
          padding: "15px",
          borderBottom: "1px solid #222",
          fontWeight: "bold"
        }}
      >
        AppBuilderAI
      </div>

      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column"
        }}
      >
        {/* Chat Section */}
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid #222"
          }}
        >
          <textarea
            placeholder="Describe the app you want..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={{
              width: "100%",
              height: "120px",
              background: "#111",
              color: "white",
              border: "1px solid #333",
              padding: "10px",
              borderRadius: "6px"
            }}
          />

          <button
            onClick={generate}
            style={{
              marginTop: "15px",
              padding: "10px 20px",
              background: "white",
              color: "black",
              border: "none",
              borderRadius: "6px",
              width: "100%"
            }}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        {/* Output Section */}
        <div
          style={{
            flex: 1,
            padding: "20px",
            overflow: "auto"
          }}
        >
          <pre
            style={{
              background: "#111",
              padding: "20px",
              borderRadius: "6px",
              minHeight: "100%",
              whiteSpace: "pre-wrap"
            }}
          >
            {code}
          </pre>
        </div>
      </div>
    </div>
  )
}
