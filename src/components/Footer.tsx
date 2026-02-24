'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer style={{ backgroundColor: 'var(--color-bg)', borderTop: '1px solid var(--color-border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <Link href="/">
              <img src="/assets/images/eeme-logo.svg" alt="eeMe" className="h-8 w-auto mb-4" />
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              {t('footer_description', 'The tech platform that finally allows you to control and own your content.')}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-text)' }}>
              {t('Quick Links', 'Quick Links')}
            </h4>
            <ul className="space-y-2">
              {[
                { href: '/talent', label: t('Talents', 'Talents') },
                { href: '/about-eeme', label: t('About eeMe', 'About eeMe') },
                { href: '/on-boarding', label: t('Join eeMe', 'Join eeMe') },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm transition-colors hover:text-primary" style={{ color: 'var(--color-text-muted)' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-text)' }}>
              {t('Legal', 'Legal')}
            </h4>
            <ul className="space-y-2">
              {[
                { href: '/terms-of-service', label: t('Terms of Service', 'Terms of Service') },
                { href: '/privacy-policy', label: t('Privacy Policy', 'Privacy Policy') },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm transition-colors hover:text-primary" style={{ color: 'var(--color-text-muted)' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            © {new Date().getFullYear()} eeMe. {t('All rights reserved.', 'All rights reserved.')}
          </p>
          <div className="flex items-center gap-4">
            {[
              { href: 'https://instagram.com/eeme', icon: 'instagram' },
              { href: 'https://twitter.com/eeme', icon: 'twitter' },
            ].map(({ href, icon }) => (
              <a key={icon} href={href} target="_blank" rel="noreferrer" className="transition-colors hover:text-primary" style={{ color: 'var(--color-text-muted)' }}>
                <img src={`/assets/images/social-logos/${icon}.svg`} alt={icon} className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
