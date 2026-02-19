import { useState } from 'react'
import { Lock, AlertCircle } from 'lucide-react'
import { useMode } from '../context/ModeProvider'

export default function AccessCodeModal() {
  const { showAccessCodeModal, dispatch } = useMode()
  const [accessCode, setAccessCode] = useState('')
  const [error, setError] = useState(false)

  if (!showAccessCodeModal) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Check against env variable
    const correctCode = import.meta.env.VITE_ACCESS_CODE || 'supersecurepass' // Don't ever do this lol...

    if (accessCode === correctCode) {
      setError(false)
      dispatch({ type: 'SET_ACCESS_GRANTED', payload: true })
      dispatch({ type: 'HIDE_ACCESS_CODE_MODAL' })
      // Show difficulty modal after access granted
      dispatch({ type: 'SHOW_DIFFICULTY_MODAL' })
    } else {
      setError(true)
      setAccessCode('')
    }
  }

  const handleBack = () => {
    dispatch({ type: 'HIDE_ACCESS_CODE_MODAL' })
    dispatch({ type: 'SHOW_MODE_MODAL' })
    setError(false)
    setAccessCode('')
  }

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-[400px] rounded-[var(--r-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-lg)]">
        {/* Header */}
        <div className="mb-5 text-center">
          <div className="mb-3 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--teal-light)]">
              <Lock size={20} className="text-[var(--teal)]" />
            </div>
          </div>
          <h2 className="mb-2 font-['DM_Sans',sans-serif] text-[22px] font-bold text-[var(--text-primary)]">
            Access Code Required
          </h2>
          <p className="font-['DM_Sans',sans-serif] text-[13px] text-[var(--text-secondary)]">
            Live mode requires an access code. Enter it below to continue.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={accessCode}
              onChange={(e) => {
                setAccessCode(e.target.value)
                setError(false)
              }}
              placeholder="Enter access code"
              autoFocus
              className={`w-full rounded-[var(--r)] border px-4 py-3 font-['DM_Sans',sans-serif] text-[14px] text-[var(--text-primary)] outline-none transition-all ${
                error
                  ? 'focus:ring-[var(--crimson)]/20 border-[var(--crimson)] bg-[var(--crimson-light)] focus:border-[var(--crimson)] focus:ring-2'
                  : 'focus:ring-[var(--teal)]/20 border-[var(--border)] bg-[var(--card)] focus:border-[var(--teal)] focus:ring-2'
              }`}
            />
            {error && (
              <div className="mt-2 flex items-center gap-1.5 text-[var(--crimson)]">
                <AlertCircle size={14} />
                <span className="font-['DM_Sans',sans-serif] text-[12px]">
                  Incorrect access code
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 cursor-pointer rounded-[var(--r)] border border-[var(--border)] bg-transparent px-4 py-2.5 font-['DM_Sans',sans-serif] text-[13px] font-semibold text-[var(--text-secondary)] transition-all hover:bg-[var(--muted-bg)]"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 cursor-pointer rounded-[var(--r)] border-none bg-[var(--teal)] px-4 py-2.5 font-['DM_Sans',sans-serif] text-[13px] font-semibold text-white transition-all hover:bg-[var(--teal-dark)]"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
