import { useAuth } from "../context/AuthContext"
import { rupees } from "../utils/formatCurrency"


function BalanceCard() {
    const { user } = useAuth()

    if (!user || !user.balance.amount) {
        return <div>Error</div>
    }

    const formatedBalance = rupees(user.balance.amount)
    const formatedLocked = rupees(user.balance.locked)
    const total = user.balance.amount + user.balance.locked
    const totalFormated = rupees(total)

    return (
        <div className="overflow-hidden rounded-2xl bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-700/20">
            <div className="p-6 sm:p-7">
                {/* Available balance */}
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-indigo-200">
                            Available Balance
                        </p>
                        <p className="mt-1.5 text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl">
                            {formatedBalance}
                        </p>
                    </div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
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
                            <path d="M19 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z" />
                            <path d="M16 12h.01" />
                        </svg>
                    </span>
                </div>

                {/* Breakdown */}
                <div className="mt-7 grid grid-cols-2 gap-4 border-t border-white/15 pt-5">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-indigo-200">
                            Total Balance
                        </p>
                        <p className="mt-1 text-lg font-semibold tabular-nums">
                            {totalFormated}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-indigo-200">
                            Locked
                        </p>
                        <p className="mt-1 text-lg font-semibold tabular-nums">{formatedLocked}</p>
                    </div>
                </div>

                {/* Explanation */}
                <div className="mt-5 flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2.5">
                    <svg
                        className="h-4 w-4 shrink-0 text-indigo-200"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4" />
                        <path d="M12 8h.01" />
                    </svg>
                    <p className="text-xs text-indigo-100">
                        {formatedLocked} currently reserved for pending transactions
                    </p>
                </div>
            </div>
        </div>
    )
}

export default BalanceCard
