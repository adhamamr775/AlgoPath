import Link from 'next/link'

const footerLinks = [
  { href: '#', label: 'Documentation' },
  { href: '#', label: 'System Status' },
  { href: '#', label: 'Privacy' },
  { href: '#', label: 'API' },
]

export default function Footer() {
  return (
    <footer className="w-full flex flex-col md:flex-row justify-between items-center px-lg gap-sm py-sm border-t border-outline-variant bg-surface-container-lowest mt-auto">
      <span className="font-code-md text-code-md text-on-surface-variant">
        © 2024 AlgoPath. MECHANICAL MINIMALISM.
      </span>
      <nav className="flex items-center gap-md font-label-caps text-label-caps">
        {footerLinks.map(({ href, label }) => (
          <Link
            key={label}
            href={href}
            className="text-on-surface-variant hover:text-primary transition-colors"
          >
            {label}
          </Link>
        ))}
      </nav>
    </footer>
  )
}
