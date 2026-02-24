import Link from 'next/link'

interface Props {
  params: { status: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function PaymentStatusPage({ params, searchParams }: Props) {
  const isSuccess = params.status === 'success'
  const orderCode = typeof searchParams?.order === 'string' ? searchParams.order : ''
  const orderRef = typeof searchParams?.ref === 'string' ? searchParams.ref : orderCode

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div
        className="max-w-md w-full text-center p-10 rounded-2xl"
        style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
      >
        {isSuccess ? (
          <>
            {/* Success icon */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: 'rgba(34,197,94,0.12)', border: '2px solid #22c55e' }}
            >
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="#22c55e" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-2xl font-black mb-2" style={{ color: 'var(--color-text)' }}>
              Booking Confirmed!
            </h1>
            <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
              Your request has been sent to the talent.
            </p>
            {orderRef && (
              <p
                className="text-xs font-mono px-4 py-2 rounded-lg my-4 inline-block"
                style={{ backgroundColor: 'rgba(59,186,177,0.1)', color: 'var(--color-primary)' }}
              >
                Order #{orderRef}
              </p>
            )}
            <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>
              You will receive your personalised video within the agreed delivery time.
            </p>
          </>
        ) : (
          <>
            {/* Failed icon */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: 'rgba(239,68,68,0.12)', border: '2px solid #ef4444' }}
            >
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>

            <h1 className="text-2xl font-black mb-2" style={{ color: 'var(--color-text)' }}>
              Payment Failed
            </h1>
            <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>
              Your payment could not be processed. Please try again or use a different payment method.
            </p>
          </>
        )}

        <div className="flex flex-col gap-3">
          <Link
            href="/talent"
            className="w-full py-3 rounded-xl font-bold text-sm uppercase tracking-wider text-center"
            style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
          >
            Browse Talents
          </Link>
          <Link
            href="/"
            className="w-full py-3 rounded-xl font-medium text-sm text-center hover:opacity-80 transition-opacity"
            style={{
              backgroundColor: 'transparent',
              color: 'var(--color-text-muted)',
              border: '1px solid var(--color-border)',
            }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
