

function Loading({ label = "Our servers are thinking really hard right now." }: { label?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
      {/* Brand mark, matching the Navbar logo */}
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
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
          <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
          <path d="M16 12h.01" />
          <path d="M3 9h18" />
        </svg>
      </div>

      {/* Spinner */}
      <svg
        className="h-6 w-6 animate-spin text-indigo-600"
        viewBox="0 0 24 24"
        fill="none"
        role="status"
        aria-label={label}
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

      <p className="text-sm font-medium text-slate-500">{label}</p>
    </div>
  )
}

export default Loading
