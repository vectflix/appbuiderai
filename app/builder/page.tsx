"use client"

import { useState, useEffect } from "react"

export default function Builder() {
  const [prompt, setPrompt] = useState("")
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)

  let recognition: any = null

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition

      if (SpeechRecognition) {
        recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.lang = "en-US"

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setPrompt(transcript)
          setListening(false)
        }

        recognition.onend = () => {
          setListening(false)
        }
      }
    }
  }, [])

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) return alert("Voice not supported")

    recognition = new SpeechRecognition()
    recognition.start()
    setListening(true)
  }

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "en-US"
    window.speechSynthesis.speak(utterance)
  }

  const generate = async () => {
    setLoading(true)

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    })

    const data = await res.json()
    setCode(data.output)
    setLoading(false)

    speak("Your app has been generated successfully.")
  }

  return (
    <div className="h-full bg-gradient-to-br from-purple-900 via-black to-indigo-900 p-8">
      <div className="grid grid-cols-2 gap-8 h-full">

        {/* LEFT PANEL */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-6 flex flex-col">

          <h2 className="text-2xl font-bold mb-4">AI Builder</h2>

          <textarea
            className="flex-1 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 resize-none"
            placeholder="Describe your app..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <div className="flex gap-4 mt-4">
            <button
              onClick={generate}
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 rounded-2xl py-3 transition"
            >
              {loading ? "Generating..." : "Generate"}
            </button>

            <button
              onClick={startListening}
              className="bg-purple-600 hover:bg-purple-500 px-4 rounded-2xl transition"
            >
              {listening ? "Listening..." : "🎤 Speak"}
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden">
          <iframe
            srcDoc={code}
            className="w-full h-full"
            sandbox="allow-scripts"
          />
        </div>
      </div>
    </div>
  )
}
