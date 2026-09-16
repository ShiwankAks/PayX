import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import type { User } from '../types/types'
import { userService } from '../api/userService'
import { rupees } from '../utils/formatCurrency'
import { useRequiredAuth } from '../hooks/useRequiredAuth'



type SubmitState = 'idle' | 'loading' | 'success' | 'error'

function SendMoney() {
  const [query, setQuery] = useState('')
  const [recipient, setRecipient] = useState<User | null>(null)
  const [amount, setAmount] = useState('')
  const [submit, setSubmit] = useState<SubmitState>('idle')
  const [allRecipients, setAllRecipients] = useState<User[]>([])
 
  const {user, getUser} = useRequiredAuth()
  
  const getReceivers = async()=>{
    try {
      const response = await userService.getReceivers()
    setAllRecipients(response.data.users)
    } catch (error) {
      setSubmit("error")
    }
    
  }

  const amountNumber = Math.round(Number(amount)*100)
  const amountValid = amount !== '' && amountNumber > 0
  const canSend = recipient !== null && amountValid && submit !== 'loading'


  const  handleSend = async()=> {
    if (!canSend) return
    setSubmit('loading')
    try {
      await userService.sendMoney(amountNumber,recipient.id)
      await getUser()
      setSubmit("success")
    } catch (error) {
      setSubmit("error")
    }
      }

  useEffect(()=>{
    getReceivers()
  },[])


  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="animate-fade-in space-y-6">
          {/* Heading */}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Send Money
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Transfer money instantly to another PayWallet user.
            </p>
          </div>

          {/* Available balance */}
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <span className="text-sm text-slate-500">Available balance</span>
            <span className="text-base font-semibold tabular-nums text-slate-900">
              {rupees(user.balance.amount)}
            </span>
          </div>

          {/* Recipient selection */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-sm font-semibold text-slate-900">Recipient</h2>

            {recipient ? (
              <div className="mt-3 flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold uppercase text-indigo-700">
                    {recipient.username.slice(0, 1)}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      @{recipient.username}
                    </p>
                    <p className="text-xs text-slate-500">{recipient.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setRecipient(null)}
                  className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
                >
                  Change
                </button>
              </div>
            ) : (
              <>
                {/* Results */}
                <ul className="mt-3 divide-y divide-slate-100">
                  {allRecipients.length === 0 && (
                    <li className="py-6 text-center text-sm text-slate-500">
                      No users found for “{query}”.
                    </li>
                  )}
                  {allRecipients.map((u) => (
                    <li key={u.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setRecipient(u)
                          setQuery('')
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-slate-50"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold uppercase text-slate-600">
                          {u.username.slice(0, 1)}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-slate-900">
                            @{u.username}
                          </span>
                          <span className="block truncate text-xs text-slate-500">
                            {u.email}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Amount */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <label
              htmlFor="amount"
              className="text-sm font-semibold text-slate-900"
            >
              Amount
            </label>
            <div className="mt-3 flex items-center rounded-xl border border-slate-200 px-4 transition-colors focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
              <span className="text-lg font-semibold text-slate-400">₹</span>
              <input
                id="amount"
                type="number"
                min="0"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-transparent py-3 pl-2 text-lg font-semibold tabular-nums text-slate-900 placeholder:font-normal placeholder:text-slate-300 focus:outline-none"
              />
            </div>
            {amount !== '' && !amountValid && (
              <p className="mt-2 text-xs text-red-600">
                Enter an amount greater than ₹0.
              </p>
            )}
          </div>

          {/* Submit state banners (UI examples) */}
          {submit === 'success' && (
            <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <DotIcon className="text-emerald-500" />
              <p>
                Money sent successfully
                {recipient ? ` to @${recipient.username}` : ''}.
              </p>
            </div>
          )}
          {submit === 'error' && (
            <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              <DotIcon className="text-red-500" />
              <p>Transfer failed. Please try again.</p>
            </div>
          )}

          {/* Action */}
          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            {submit === 'loading' ? (
              <>
                <Spinner />
                Sending…
              </>
            ) : (
              'Send Money'
            )}
          </button>
        </div>
      </main>
    </div>
  )
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z"
      />
    </svg>
  )
}

function DotIcon({ className }: { className?: string }) {
  return (
    <svg
      className={`mt-0.5 h-4 w-4 shrink-0 ${className ?? ''}`}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="5" />
    </svg>
  )
}

export default SendMoney
