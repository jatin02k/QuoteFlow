// src/app/(auth)/verify/page.tsx
"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import { VerifyOtp} from "@/actions/auth"

function VerifyContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await VerifyOtp(email, otp)

    // Note: If verification is successful, the server action automatically 
    // fires redirect() which forces navigation. We only manage error states here.
    if (result && !result.success) {
      setError(result.error || "Invalid code. Try again.")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-base px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="font-heading text-5xl font-bold tracking-tight text-text-primary">
            RFQPilot
          </h1>
        </div>

        <div className="border border-border-strong bg-bg-surface p-6 rounded-md">
          <h2 className="font-heading text-2xl font-medium text-text-primary mb-1">
            Check your email
          </h2>
          <p className="font-body text-sm text-text-secondary mb-4">
            We sent a verification code to <span className="font-mono font-medium text-text-primary">{email}</span>
          </p>
          <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
            <div>
              <label htmlFor="otp" className="input-label text-lg font-medium">
                6-Digit Verification Code
              </label>
              <input
                id="otp"
                type="text"
                maxLength={6}
                required
                pattern="\d{6}"
                className="input text-lg mt-3 border border-border px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // Numbers only input filter
                disabled={loading}
              />
            </div>

            {error && (
              <p className="font-body text-xs text-error font-medium bg-error-bg border border-error p-2 rounded-sm">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-medium mt-3 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"

            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading verification page...</div>}>
      <VerifyContent />
    </Suspense>
  )
}