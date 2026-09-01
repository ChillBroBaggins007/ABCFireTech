import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Flame, Mail, Lock, ArrowRight, Shield, User, AlertCircle, Sparkles } from 'lucide-react'
import { useAuth } from '../lib/auth'

export default function SignInPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) { setError(error); return }
    // Redirect based on email
    if (email === 'admin@abcfiretech.co.zw') navigate('/admin')
    else navigate('/dashboard')
  }

  async function handleDemo(type: 'admin' | 'user') {
    setError(null)
    setDemoLoading(type)
    const demoEmail = type === 'admin' ? 'admin@abcfiretech.co.zw' : 'demo@abcfiretech.co.zw'
    const { error } = await signIn(demoEmail, 'demo123456')
    setDemoLoading(null)
    if (error) { setError(error); return }
    navigate(type === 'admin' ? '/admin' : '/dashboard')
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="relative hidden w-1/2 gradient-hero lg:block">
        <div className="absolute -right-24 top-20 h-96 w-96 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 shadow-lg shadow-brand-600/30">
              <Flame className="h-6 w-6 text-white" />
            </div>
            <span className="font-display text-xl font-extrabold tracking-tight text-white">ABC Firetech</span>
          </Link>
          <div>
            <h2 className="font-display text-4xl font-extrabold leading-tight text-white text-balance">
              Your fire safety,<br />managed in one place.
            </h2>
            <p className="mt-4 max-w-md text-lg text-white/70">
              Track orders, schedule service requests, and manage your fire safety compliance — all from your dashboard.
            </p>
            <div className="mt-8 flex items-center gap-6 text-sm text-white/60">
              <span className="flex items-center gap-2"><Shield className="h-4 w-4 text-brand-400" /> Secure access</span>
              <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand-400" /> 24/7 portal</span>
            </div>
          </div>
          <p className="text-sm text-white/40">© 2026 ABC Firetech. Fire safety across Zimbabwe.</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full flex-col items-center justify-center bg-ink-50 px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link to="/" className="mb-6 inline-flex items-center gap-2.5 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600">
                <Flame className="h-6 w-6 text-white" />
              </div>
              <span className="font-display text-xl font-extrabold tracking-tight text-ink-900">ABC Firetech</span>
            </Link>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-900">Welcome back</h1>
            <p className="mt-2 text-sm text-ink-500">Sign in to your client portal</p>
          </div>

          {/* Demo buttons */}
          <div className="mb-6 rounded-2xl border border-brand-200 bg-brand-50/50 p-4">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-700">
              <Sparkles className="h-4 w-4" /> Demo Access — One Click
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleDemo('admin')}
                disabled={!!demoLoading}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-brand-300 bg-white px-4 py-3 transition-all hover:border-brand-500 hover:shadow-md active:scale-[0.98] disabled:opacity-50"
              >
                <Shield className="h-5 w-5 text-brand-600" />
                <span className="text-sm font-semibold text-ink-900">Admin Demo</span>
                <span className="text-xs text-ink-500">CRM & Dashboard</span>
              </button>
              <button
                onClick={() => handleDemo('user')}
                disabled={!!demoLoading}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-brand-300 bg-white px-4 py-3 transition-all hover:border-brand-500 hover:shadow-md active:scale-[0.98] disabled:opacity-50"
              >
                <User className="h-5 w-5 text-brand-600" />
                <span className="text-sm font-semibold text-ink-900">User Demo</span>
                <span className="text-xs text-ink-500">Client Portal</span>
              </button>
            </div>
            {demoLoading && (
              <p className="mt-2 text-center text-xs text-brand-600">
                Signing in as {demoLoading === 'admin' ? 'admin' : 'demo user'}...
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-ink-200" />
            <span className="text-xs text-ink-400">or sign in manually</span>
            <div className="h-px flex-1 bg-ink-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="input pl-11"
                  required
                />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pl-11"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Signing in...' : 'Sign In'} <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-brand-600 hover:text-brand-700">
              Create one
            </Link>
          </p>
          <p className="mt-4 text-center text-xs text-ink-400">
            Demo passwords: <code className="rounded bg-ink-100 px-1.5 py-0.5">demo123456</code>
          </p>
        </div>
      </div>
    </div>
  )
}
