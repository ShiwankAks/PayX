import {  useState } from 'react'
import Navbar from '../components/Navbar'
import { rupees } from '../utils/formatCurrency'
import { userService } from '../api/userService'
import { useRequiredAuth } from '../hooks/useRequiredAuth'


// Mock providers (map to the `provider` string field).
const providers = ['Axis Bank', 'HDFC Bank', 'ICICI Bank', 'SBI']

type SubmitState = 'idle' | 'loading' | 'success' | 'error'



function AddMoney() {
  const [amount, setAmount] = useState('')
  const [provider, setProvider] = useState<string | null>(null)
  const [submit, setSubmit] = useState<SubmitState>('idle')

  const {user, getUser} = useRequiredAuth()
 
  

  const amountpaise = Number(amount)*100
  const amountValid = amount !== '' && amountpaise > 0
  const canAdd = amountValid && provider !== null && submit !== 'loading'
  
  const availableBalance = rupees(user.balance.amount)


  const handleAdd = async()=>{

    if (!canAdd) return
    setSubmit('loading')
    try {
      await userService.addMoney(amountpaise,provider)
      await getUser()
      setSubmit("success")
    } catch (error) {
      setSubmit("error")
    }
    
  }

 
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="animate-fade-in space-y-6">
          {/* Heading */}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Add Money
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Add funds to your wallet from your bank or provider.
            </p>
          </div>

          {/* Available balance */}
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <span className="text-sm text-slate-500">Available balance</span>
            <span className="text-base font-semibold tabular-nums text-slate-900">
              
              {availableBalance}
            
            </span>
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

            {/* Quick amount chips */}
            <div className="mt-3 flex flex-wrap gap-2">
              {[500, 1000, 2000, 5000].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setAmount(String(v))}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  ₹{v.toLocaleString('en-IN')}
                </button>
              ))}
            </div>

            {amount !== '' && !amountValid && (
              <p className="mt-2 text-xs text-red-600">
                Enter an amount greater than ₹0.
              </p>
            )}
          </div>

          {/* Provider */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-sm font-semibold text-slate-900">
              Select provider
            </h2>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {providers.map((p) => {
                const active = provider === p
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setProvider(p)}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                      active
                        ? 'border-indigo-400 bg-indigo-50/60 ring-2 ring-indigo-100'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold ${
                        active
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {p.slice(0, 1)}
                    </span>
                    <span className="text-sm font-medium text-slate-900">
                      {p}
                    </span>
                    {active && (
                      <svg
                        className="ml-auto h-5 w-5 text-indigo-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Review */}
          {amountValid && provider && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-sm font-semibold text-slate-900">Review</h2>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Amount</dt>
                  <dd className="font-semibold tabular-nums text-slate-900">
                    {rupees(amountpaise)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Provider</dt>
                  <dd className="font-medium text-slate-900">{provider}</dd>
                </div>
              </dl>
              <p className="mt-3 text-xs text-slate-500">
                Money will be added to your wallet after the provider confirms
                the payment.
              </p>
            </div>
          )}

          {/* Submit state banners (UI examples) */}
          {submit === 'success' && (
            <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <DotIcon className="text-emerald-500" />
              <p>Money added to your wallet successfully.</p>
            </div>
          )}
          {submit === 'error' && (
            <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              <DotIcon className="text-red-500" />
              <p>Could not add money. Please try again.</p>
            </div>
          )}

          {/* Action */}
          <button
            type="button"
            onClick={handleAdd}
            disabled={!canAdd}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            {submit === 'loading' ? (
              <>
                <Spinner />
                Adding…
              </>
            ) : (
              'Add Money'
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

export default AddMoney
