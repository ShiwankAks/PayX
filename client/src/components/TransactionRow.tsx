import { rupees } from '../utils/formatCurrency'


export function TransactionRow({
  incoming,
  title,
  subtitle,
  amount,
  status,
}: {
  incoming: boolean
  title: string
  subtitle: string
  amount: number // paisa
  status: string
}) {
  return (
    <li className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-slate-50 sm:px-6">
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          incoming ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
        }`}
      >
        <ArrowIcon incoming={incoming} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-900">{title}</p>
        <p className="truncate text-xs text-slate-500">{subtitle}</p>
      </div>

      <div className="text-right">
        <p
          className={`text-sm font-semibold tabular-nums ${
            incoming ? 'text-emerald-600' : 'text-slate-900'
          }`}
        >
          {incoming ? '+' : '−'} {rupees(amount)}
        </p>
        <span
          className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${statusPill(status)}`}
        >
          {statusLabel(status)}
        </span>
      </div>
    </li>
  )
}

// Status pill styling. Transfer 'Failed' and on-ramp 'Failure' share red.
function statusPill(status: string): string {
  if (status === 'Success') return 'bg-emerald-50 text-emerald-700'
  if (status === 'Processing') return 'bg-amber-50 text-amber-700'
  return 'bg-red-50 text-red-700'
}

function statusLabel(status: string): string {
  if (status === 'Success') return 'Successful'
  if (status === 'Processing') return 'Processing'
  return 'Failed'
}

function ArrowIcon({ incoming }: { incoming: boolean }) {
  return (
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
      {incoming ? (
        <>
          <path d="M12 5v14" />
          <path d="m19 12-7 7-7-7" />
        </>
      ) : (
        <>
          <path d="M12 19V5" />
          <path d="m5 12 7-7 7 7" />
        </>
      )}
    </svg>
  )
}

export default TransactionRow
