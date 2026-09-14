import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import TransactionRow from '../components/TransactionRow'
import { userService } from '../api/userService'
import type { OnRampTransaction, Transfer } from '../types/types'
import { useRequiredAuth } from '../hooks/useRequiredAuth'
import Loading from '../pages/Loading'




// ISO -> "9 Sep 2026, 2:14 PM" (full history shows the year).
function when(iso: string): string {
  const d = new Date(iso)
  return `${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}, ${d.toLocaleTimeString(
    'en-IN',
    { hour: 'numeric', minute: '2-digit', hour12: true },
  )}`
}

type Tab = 'transfers' | 'onramp'
type ViewState = 'loaded' | 'loading' | 'empty' | 'error'

function Transactions() {
  const [tab, setTab] = useState<Tab>('transfers')
  const [transferView, setTransferView] = useState<ViewState>('loading')
  const [onRampView, setOnRampView] = useState<ViewState>('loading')
  const [allTransfers, setAllTransfers] = useState<Transfer[]>([])
  const [allOnRampTrans, setAllOnRampTrans] = useState<OnRampTransaction[]>([])


  const tabClass = (active: boolean) =>
    `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${active
      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
      : 'text-slate-500 hover:text-slate-900'
    }`

  const { user, loading } = useRequiredAuth()

  const getTransfers = async () => {
    setTransferView("loading")
    try {
      const response = await userService.getTransfers()
      setAllTransfers(response.data.history)
      if (response.data.history.length === 0) setTransferView("empty")
      else setTransferView("loaded")
    } catch (error) {
      setTransferView("error")
    }
  }

  const getOnRampTrans = async () => {
    try {
      setOnRampView("loading")
      const res = await userService.getOnrampTransactions()
      setAllOnRampTrans(res.data.transactions)
      if (res.data.transactions.length === 0) setOnRampView("empty")
      else setOnRampView("loaded")
    } catch (error) {
      setOnRampView("error")
    }

  }

  useEffect(() => {
    getTransfers()
    // getCurrentUser()
    getOnRampTrans()
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="animate-fade-in space-y-6">
          {/* Heading */}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Transaction History
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              All your transfers and money added to your wallet.
            </p>
          </div>

          {/* Tabs + demo state switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex gap-1 rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setTab('transfers')}
                className={tabClass(tab === 'transfers')}
                aria-pressed={tab === 'transfers'}
              >
                Transfers
              </button>
              <button
                type="button"
                onClick={() => setTab('onramp')}
                className={tabClass(tab === 'onramp')}
                aria-pressed={tab === 'onramp'}
              >
                On-Ramp
              </button>
            </div>

          </div>

          {/* Card */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
              <h2 className="text-base font-semibold text-slate-900">
                {tab === 'transfers' ? 'Transfers' : 'Added money'}
              </h2>
            </div>

            {tab === "transfers" && (
              <>
                {transferView === 'loading' && <LoadingState />}
                {transferView === 'empty' && <EmptyState />}
                {transferView === 'error' && <ErrorState onRetry={() => getTransfers} />}

                {transferView === 'loaded' &&  (
                  <ul className="divide-y divide-slate-100">
                    {allTransfers.map((t) => {
                      const incoming = t.receiverId === user.id
                      const name = incoming ? t.sender.username : t.receiver.username
                      return (
                        <TransactionRow
                          key={t.id}
                          incoming={incoming}
                          title={incoming ? `Received from ${name}` : `Sent to ${name}`}
                          subtitle={`${incoming ? 'Received' : 'Sent'} · ${when(t.createdAt)}`}
                          amount={t.amount}
                          status={t.status}
                        />
                      )
                    })}
                  </ul>
                )}
              </>
            )}
            {tab === "onramp" && (
              <>
                {onRampView === 'loading' && <LoadingState />}
                {onRampView === 'empty' && <EmptyState />}
                {onRampView === 'error' && <ErrorState onRetry={() =>getOnRampTrans} />}
                {onRampView === 'loaded'  && (
                  <ul className="divide-y divide-slate-100">
                    {allOnRampTrans.map((o) => (
                      <TransactionRow
                        key={o.id}
                        incoming
                        title="Added money"
                        subtitle={`${o.provider} · ${when(o.startTime)}`}
                        amount={o.amount}
                        status={o.status}
                      />
                    ))}
                  </ul>
                )}
              </>
            )}

          </section>
        </div>
      </main>
    </div>
  )
}

function LoadingState() {
  return (
    <ul className="divide-y divide-slate-100">
      {[0, 1, 2, 3, 4].map((i) => (
        <li key={i} className="flex items-center gap-4 px-5 py-4 sm:px-6">
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-slate-100" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-40 animate-pulse rounded bg-slate-100" />
            <div className="h-3 w-28 animate-pulse rounded bg-slate-100" />
          </div>
          <div className="space-y-2">
            <div className="h-3.5 w-16 animate-pulse rounded bg-slate-100" />
            <div className="ml-auto h-3 w-12 animate-pulse rounded bg-slate-100" />
          </div>
        </li>
      ))}
    </ul>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect width="18" height="14" x="3" y="5" rx="2" />
          <path d="M3 10h18" />
        </svg>
      </span>
      <p className="mt-4 text-sm font-medium text-slate-900">
        No transactions yet
      </p>
      <p className="mt-1 text-sm text-slate-500">
        Your wallet activity will appear here.
      </p>
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4" />
          <path d="M12 16h.01" />
        </svg>
      </span>
      <p className="mt-4 text-sm font-medium text-slate-900">
        Unable to load transactions
      </p>
      <p className="mt-1 text-sm text-slate-500">
        Something went wrong. Please try again.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 active:scale-[0.98]"
      >
        Retry
      </button>
    </div>
  )
}

export default Transactions
