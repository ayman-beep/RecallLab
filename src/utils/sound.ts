/**
 * Tiny synthesised feedback sounds — no audio assets, no network requests.
 * Everything respects the user's sound preference (checked by the caller).
 */

let ctx: AudioContext | null = null

function audioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  if (!ctx) ctx = new Ctor()
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function tone(freq: number, start: number, duration: number, gain: number, type: OscillatorType = 'sine') {
  const context = audioContext()
  if (!context) return
  const osc = context.createOscillator()
  const amp = context.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, context.currentTime + start)
  amp.gain.setValueAtTime(0, context.currentTime + start)
  amp.gain.linearRampToValueAtTime(gain, context.currentTime + start + 0.012)
  amp.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + start + duration)
  osc.connect(amp).connect(context.destination)
  osc.start(context.currentTime + start)
  osc.stop(context.currentTime + start + duration + 0.02)
}

export type SoundKind = 'success' | 'error' | 'mastered' | 'complete' | 'click'

export function playSound(kind: SoundKind, enabled: boolean) {
  if (!enabled) return
  try {
    switch (kind) {
      case 'success':
        tone(659.25, 0, 0.12, 0.06, 'triangle')
        tone(987.77, 0.06, 0.16, 0.045, 'triangle')
        break
      case 'error':
        tone(196, 0, 0.18, 0.06, 'sawtooth')
        tone(146.83, 0.05, 0.22, 0.04, 'sawtooth')
        break
      case 'mastered':
        tone(523.25, 0, 0.12, 0.05)
        tone(659.25, 0.09, 0.12, 0.05)
        tone(783.99, 0.18, 0.2, 0.05)
        break
      case 'complete':
        tone(440, 0, 0.14, 0.05, 'triangle')
        tone(554.37, 0.1, 0.14, 0.05, 'triangle')
        tone(659.25, 0.2, 0.22, 0.05, 'triangle')
        break
      case 'click':
        tone(880, 0, 0.04, 0.02, 'square')
        break
    }
  } catch {
    /* Audio is a nicety — never let it break a study session. */
  }
}
