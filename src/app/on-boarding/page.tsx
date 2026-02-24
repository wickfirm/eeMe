import Link from 'next/link'

export const revalidate = 86400

export default function OnboardingPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div
        className="max-w-lg w-full text-center p-10 rounded-2xl"
        style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
      >
        {/* Icon */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: 'rgba(59,186,177,0.12)', border: '2px solid var(--color-primary)' }}
        >
          <svg
            className="w-10 h-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            style={{ color: 'var(--color-primary)' }}
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-black mb-2" style={{ color: 'var(--color-text)' }}>
          Join eeMe as a Talent
        </h1>
        <p className="text-sm mb-8 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
          Share your talent with the world. Connect with fans and brands who want to book
          personalised content from you.
        </p>

        <div className="space-y-4 text-left mb-8">
          {[
            { icon: '🎬', title: 'Create personalised videos', desc: 'Record shoutouts and messages for fans on request' },
            { icon: '💰', title: 'Set your own prices', desc: 'You decide how much to charge per video or campaign' },
            { icon: '📱', title: 'Manage from anywhere', desc: 'Accept or decline bookings on your schedule' },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-4">
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <div>
                <p className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>{item.title}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <a
          href="https://eeme.io/on-boarding"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest mb-4"
          style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
        >
          Apply Now →
        </a>

        <Link
          href="/"
          className="text-sm hover:underline"
          style={{ color: 'var(--color-text-muted)' }}
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
