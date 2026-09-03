"use client";
import { SendOtp } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await SendOtp(email);
    
    if (result.success) {
      router.push(`/verify?email=${encodeURIComponent(email)}`);
    } else {
      setError(result.error || "An error occurred. Please try again.");
      setLoading(false);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-base px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="font-heading text-5xl font-bold tracking-tight text-text-primary">
            RFQDeck
          </h1>
          <p className="font-body text-lg text-text-muted mt-3">
            Vendor quotes. Compared. In minutes.
          </p>
        </div>
        <div className="border border-border-strong bg-bg-surface p-6 rounded-md shadow-sm">
          <h2 className="font-heading text-2xl font-medium text-text-primary mb-9">
            Sign in to RFQDeck
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="input-label text-lg font-medium"
              >
                Work Email:
              </label>
              <input
                id="email"
                type="email"
                required
                className="input ml-3 text-lg border border-border px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="owner@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              className="btn-primary w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-medium mt-9 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
          <p className="font-body text-sm text-text-muted mt-9">
            We'll send a 6-digit code to your email for verification. Please
            check your inbox and spam folder.
          </p>
        </div>
      </div>
    </div>
  );
}
