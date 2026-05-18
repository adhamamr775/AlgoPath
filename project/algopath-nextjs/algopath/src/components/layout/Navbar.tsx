'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/problems', label: 'Problems' },
  { href: '/topics', label: 'Topics' },
  { href: '/profile', label: 'Profile' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()

  return (
    <header className="fixed top-0 left-0 w-full z-50 h-16 bg-surface-dim border-b border-outline-variant">
      <div className="flex justify-between items-center h-full px-lg max-w-container-max mx-auto w-full">
        {/* Brand */}
        <Link
          href="/dashboard"
          className="font-headline-md text-headline-md font-bold tracking-tighter text-primary"
        >
          AlgoPath
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-md h-full pt-1">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={
                  isActive
                    ? 'text-primary border-b-2 border-primary pb-1 font-label-caps text-label-caps px-sm pt-xs h-full flex items-center'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors duration-200 font-label-caps text-label-caps px-sm py-xs h-full flex items-center'
                }
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-sm">
          <button
            aria-label="notifications"
            className="text-on-surface-variant hover:text-on-surface transition-colors p-xs hover:bg-surface-container-high rounded"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>

          {user ? (
            <div className="flex items-center gap-sm">
              <div className="w-8 h-8 bg-surface-variant border border-outline-variant rounded overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${user.username}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={logout}
                className="font-label-caps text-label-caps text-on-surface-variant hover:text-error transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-primary text-on-primary font-label-caps text-label-caps px-sm py-xs rounded hover:opacity-90 transition-opacity"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
