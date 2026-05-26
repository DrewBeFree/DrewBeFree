import { useEffect, useRef, useState, useCallback } from 'react'

const THRESHOLD = 14   // m/s² — lower = more sensitive
const COOLDOWN  = 1500 // ms between triggers

export function useShakeDetector(onShake) {
  const [enabled, setEnabled]           = useState(false)
  const [needsPermission, setNeeds]     = useState(false)
  const lastShakeRef                    = useRef(0)
  const callbackRef                     = useRef(onShake)
  callbackRef.current                   = onShake

  const startListening = useCallback(() => {
    const handler = (e) => {
      const a = e.accelerationIncludingGravity
      if (!a || a.x == null) return
      const mag = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z)
      const now = Date.now()
      if (mag > THRESHOLD && now - lastShakeRef.current > COOLDOWN) {
        lastShakeRef.current = now
        callbackRef.current()
      }
    }
    window.addEventListener('devicemotion', handler)
    setEnabled(true)
    return handler
  }, [])

  useEffect(() => {
    if (typeof DeviceMotionEvent === 'undefined') return

    // iOS 13+ requires a user-gesture permission prompt
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      setNeeds(true)
      return
    }

    const handler = startListening()
    return () => window.removeEventListener('devicemotion', handler)
  }, [startListening])

  const requestPermission = useCallback(async () => {
    if (typeof DeviceMotionEvent?.requestPermission !== 'function') return
    try {
      const result = await DeviceMotionEvent.requestPermission()
      if (result === 'granted') {
        setNeeds(false)
        startListening()
      }
    } catch {
      // User denied — shake won't work but the + button still works
    }
  }, [startListening])

  return { enabled, needsPermission, requestPermission }
}
