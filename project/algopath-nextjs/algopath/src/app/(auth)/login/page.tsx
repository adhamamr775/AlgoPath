'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/stores/authStore'

export default function LoginPage() {
  const router = useRouter()
  const setUser = useAuthStore((s) => s.setUser)

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [form, setForm] = useState({ email: '', password: '', username: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      let data
      if (mode === 'login') {
        data = await authService.login({ email: form.email, password: form.password })
      } else {
        data = await authService.register({ email: form.email, password: form.password, username: form.username })
      }
      setUser(data.user, data.token)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-background text-on-surface">
      {/* Left: Branding Panel */}
      <div className="hidden md:flex relative w-1/2 h-full bg-surface-container-lowest border-r border-outline-variant overflow-hidden flex-col justify-between p-xl">
        <div
          className="absolute inset-0 opacity-40 mix-blend-luminosity bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-surface-container-lowest/80 via-transparent to-surface-container-lowest/90" />

        {/* Top logo */}
        <div className="relative z-10 flex items-center gap-xs">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            terminal
          </span>
          <span className="font-headline-md text-headline-md font-bold tracking-tighter text-on-surface">AlgoPath</span>
        </div>

        {/* Center slogan */}
        <div className="relative z-10 max-w-md">
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-sm">Master the Path.</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-sm">
            Precision tools for competitive programmers. Optimize logic, track mastery, and execute with absolute authority.
          </p>
        </div>

        {/* Bottom status */}
        <div className="relative z-10 flex gap-md font-code-md text-code-md text-on-surface-variant opacity-60">
          <div className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-[16px]">fiber_manual_record</span>
            <span>SYS_ONLINE</span>
          </div>
          <div className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-[16px]">memory</span>
            <span>LATENCY: 12ms</span>
          </div>
        </div>
      </div>

      {/* Right: Auth Form */}
      <div className="flex-1 flex items-center justify-center h-full p-lg bg-surface relative overflow-y-auto">
        {/* Mobile logo */}
        <div className="md:hidden absolute top-lg left-lg flex items-center gap-xs">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            terminal
          </span>
          <span className="font-headline-md text-headline-md font-bold tracking-tighter text-on-surface">AlgoPath</span>
        </div>

        <div className="w-full max-w-[400px]">
          <div className="mb-xl">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-xs">System Access</h2>
            <p className="font-code-md text-code-md text-on-surface-variant">Authenticate to initialize environment.</p>
          </div>

          <form className="space-y-lg" onSubmit={handleSubmit}>
            {/* Tab Toggle */}
            <div className="flex border-b border-outline-variant mb-md">
              {(['login', 'register'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => { setMode(tab); setError('') }}
                  className={`flex-1 pb-xs text-center border-b-2 font-label-caps text-label-caps uppercase tracking-widest transition-colors ${
                    mode === tab
                      ? 'border-primary text-primary'
                      : 'border-transparent text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="space-y-md">
              {/* Username (register only) */}
              {mode === 'register' && (
                <div className="space-y-xs">
                  <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="username">
                    Username
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-sm text-outline">
                      <span className="material-symbols-outlined text-[18px]">badge</span>
                    </span>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={form.username}
                      onChange={handleChange}
                      placeholder="operator_42"
                      className="w-full bg-surface-dim border border-outline-variant rounded-DEFAULT py-sm pr-sm pl-xl text-on-surface font-code-md text-code-md placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-xs">
                <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="email">
                  Operator ID (Email)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-sm text-outline">
                    <span className="material-symbols-outlined text-[18px]">person</span>
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="user@domain.tld"
                    className="w-full bg-surface-dim border border-outline-variant rounded-DEFAULT py-sm pr-sm pl-xl text-on-surface font-code-md text-code-md placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-xs">
                <div className="flex justify-between items-center">
                  <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="password">
                    Passkey
                  </label>
                  {mode === 'login' && (
                    <a href="#" className="font-code-md text-[12px] text-primary hover:text-primary-fixed transition-colors">
                      Forgot key?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-sm text-outline">
                    <span className="material-symbols-outlined text-[18px]">key</span>
                  </span>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-surface-dim border border-outline-variant rounded-DEFAULT py-sm pr-sm pl-xl text-on-surface font-code-md text-code-md placeholder:text-outline tracking-[0.2em] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="font-code-md text-code-md text-error">{error}</p>
            )}

            <div className="pt-sm">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-on-primary py-sm px-md rounded-DEFAULT font-body-lg text-body-lg font-bold hover:bg-primary-container hover:text-on-primary-container transition-colors duration-200 flex justify-center items-center gap-xs disabled:opacity-50"
              >
                <span>{loading ? 'Authenticating...' : mode === 'login' ? 'Login' : 'Register'}</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          </form>

          <div className="mt-lg relative flex items-center justify-center">
            <div className="absolute inset-x-0 h-px bg-outline-variant" />
            <span className="relative bg-surface px-sm font-code-md text-[12px] text-on-surface-variant">
              OR CONNECT VIA
            </span>
          </div>

          <div className="mt-md flex gap-sm">
            <button
              type="button"
              className="flex-1 border border-outline-variant rounded-DEFAULT py-xs px-sm flex items-center justify-center hover:bg-surface-container transition-colors group"
            >
              <span className="font-code-md text-code-md text-on-surface-variant group-hover:text-on-surface">
                Guest Access
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
