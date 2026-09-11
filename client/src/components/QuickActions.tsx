import { Link } from 'react-router-dom'

function QuickActions() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* Add Money - primary */}
      <Link
        to="/add-money"
        className="group flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:border-indigo-200 hover:shadow-md active:scale-[0.99]"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition-colors group-hover:bg-indigo-700">
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
        </span>
        <span>
          <span className="block text-sm font-semibold text-slate-900">
            Add Money
          </span>
          <span className="mt-0.5 block text-xs text-slate-500">
            Add funds to your wallet
          </span>
        </span>
      </Link>

      {/* Send Money - primary */}
      <Link
        to="/send"
        className="group flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:border-indigo-200 hover:shadow-md active:scale-[0.99]"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition-colors group-hover:bg-indigo-700">
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
          </svg>
        </span>
        <span>
          <span className="block text-sm font-semibold text-slate-900">
            Send Money
          </span>
          <span className="mt-0.5 block text-xs text-slate-500">
            Transfer money to another user
          </span>
        </span>
      </Link>

      {/* Withdraw - coming soon */}
      <button
        type="button"
        disabled
        className="group flex cursor-not-allowed items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-left opacity-75"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <path d="M2 10h20" />
          </svg>
        </span>
        <span>
          <span className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-900">
              Withdraw
            </span>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
              Coming soon
            </span>
          </span>
          <span className="mt-0.5 block text-xs text-slate-500">
            Transfer money to your bank
          </span>
        </span>
      </button>
    </div>
  )
}

export default QuickActions
