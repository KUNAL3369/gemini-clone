let lastCall = 0
export function simulateAIReply(prompt, cb){
  const now = Date.now()
  const minGap = 1500
  const gap = Math.max(0, minGap - (now - lastCall))
  lastCall = now + gap
  setTimeout(() => {
    cb(`Gemini: ${prompt.slice(0,120)} (simulated reply)`)
  }, gap + 900)
}
