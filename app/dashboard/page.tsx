"use client"

import { useState } from "react"

export default function Dashboard() {
  const [code, setCode] = useState("// AI generated code will appear here")

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
      {/* Mobile Header */}
      <div
        style={{
          padding: "15px",
          borderBottom: "1px solid #222",
          fontWeight: "bold"
        }}
      >
        AppBuilderAI
      </div>

      {/* Main Layout */}
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: window.innerWidth < 768 ? "column" : "row"
        }}
      >
        {/* Chat Panel */}
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            borderRight: window.innerWidth >= 768 ? "1px solid #222" : "none",
            borderBottom: window.innerWidth < 768 ? "1px solid #222" : "none",
            padding: "20px"
          }}
        >
          <h2>AI Chat</h2>

          <textarea
            placeholder="Describe the app you want..."
            style={{
              width: "100%",
              height: "150px",
              marginTop: "15px",
              background: "#111",
              color: "white",
              border: "1px solid #333",
              padding: "10px",
              borderRadius: "6px"
            }}
          />

          <button
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
            Generate
          </button>
        </div>

        {/* Code Panel */}
        <div
          style={{
            flex: 1,
            padding: "20px",
            overflow: "auto"
          }}
        >
          <h2>Code Output</h2>

          <pre
            style={{
              marginTop: "15px",
              background: "#111",
              padding: "20px",
              overflow: "auto",
              height: "70vh",
              borderRadius: "6px"
            }}
          >
            {code}
          </pre>
        </div>
      </div>
    </div>
  )
}
