import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import TransactionRow from './TransactionRow'
import { userService } from '../api/userService'
import type { OnRampTransaction, Transfer } from '../types/types'
import { useRequiredAuth } from '../hooks/useRequiredAuth'

// --- Local helper -----------------------------------------------------------

// ISO -> "9 Sep, 2:14 PM" (dashboard omits the year to stay compact).
function when(iso: string): string {
  const d = new Date(iso)
  return `${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}, ${d.toLocaleTimeString(
    'en-IN',
    { hour: 'numeric', minute: '2-digit', hour12: true },
  )}`
}

// UI state for loading/empty/error. Swap to real async state later.
type ViewState = 'loaded' | 'loading' | 'empty' | 'error'
type Tab = 'transfers' | 'onramp'

function RecentTransactions() {
  const [tab, setTab] = useState<Tab>('transfers')
  const [view, setView] = useState<ViewState>('loaded')
  const [allTransfers, setAllTransfers] = useState<Transfer[]>([])
  const [allOnRampTrans, setAllOnRampTrans] = useState<OnRampTransaction[]>([])
  const {user} = useRequiredAuth()

 
    const getTransfers = async () => {
      setView("loading")
      try {
        const response = await userService.getTransfers(3)
        setAllTransfers(response.data.history)
        setView("loaded")
      } catch (error) {
        setView("error")
      }
    }
  
    const getOnRampTrans =async ()=>{
      try {
        setView("loading")
        const res = await userService.getOnrampTransactions(3)
      setAllOnRampTrans(res.data.transactions)
      setView("loaded")
      } catch (error) {
        setView("error")
      }
      
    }

    useEffect(() => {
        getTransfers()
        getOnRampTrans()
      }, [])


  const tabClass = (active: boolean) =>
    `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${active
      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
      : 'text-slate-500 hover:text-slate-900'
    }`

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
        <h2 className="text-base font-semibold text-slate-900">
          Recent Transactions
        </h2>
        <Link
          to={tab === 'transfers' ? '/transactions' : '/transactions/on-ramp'}
          className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
        >
          View all
        </Link>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-100 px-5 py-3 sm:px-6">
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

      {view === 'loading' && <LoadingState />}
      {view === 'empty' && <EmptyState />}
      {view === 'error' && <ErrorState onRetry={() => setView('loaded')} />}

      {view === 'loaded' && tab === 'transfers' && (
        <ul className="divide-y divide-slate-100">
          {allTransfers.map((t) => {
            const incoming = t.receiverId === user.id
            const other = incoming? t.sender.username : t.receiver.username 
            return (
              <TransactionRow
                key={t.id}
                incoming={incoming}
                title={incoming ? `Received from ${other}` : `Sent to ${other}`}
                subtitle={`${other} · ${when(t.createdAt)}`}
                amount={t.amount}
                status={t.status}
              />
            )
          })}
        </ul>
      )}

      {view === 'loaded' && tab === 'onramp' && (
        <ul className="divide-y divide-slate-100">
          {allOnRampTrans.map((o) => (
            <TransactionRow
              key={o.id}
              incoming // on-ramp is always money into the wallet
              title="Added money"
              subtitle={`${o.provider} · ${when(o.startTime)}`}
              amount={o.amount}
              status={o.status}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

function LoadingState() {
  return (
    <ul className="divide-y divide-slate-100">
      {[0, 1, 2, 3].map((i) => (
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
    <div className="flex flex-col items-center px-6 py-14 text-center">
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
        Your recent wallet activity will appear here.
      </p>
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
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

export default RecentTransactions
