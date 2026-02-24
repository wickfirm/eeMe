import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="text-center">
        <p
          className="text-8xl font-black mb-4"
          style={{ color: 'var(--color-primary)', opacity: 0.3 }}
        >
          404
        </p>
        <h1 className="text-2xl font-black mb-2" style={{ color: 'var(--color-text)' }}>
          Page Not Found
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>
          The page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-wider"
          style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
