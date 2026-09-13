import { useNavigate } from "react-router-dom"


function NotFound() {
    const navigate = useNavigate()
  return (
    <main
      aria-label="Page not found"
      className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12"
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white px-8 py-12 text-center shadow-sm sm:px-12 sm:py-14">
        {/* Elegant 404 with a subtle accent underline */}
        <div className="flex flex-col items-center">
          <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-600">
            Error 404
          </span>
          <p className="mt-6 text-7xl font-semibold tracking-tight text-slate-900 tabular-nums sm:text-8xl">
            404
          </p>
          <span
            aria-hidden="true"
            className="mt-4 h-1 w-12 rounded-full bg-indigo-600"
          />
        </div>

        {/* Message */}
        <h1 className="mt-8 text-xl font-semibold tracking-tight text-slate-900">
          Page not found
        </h1>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-500">
          The page you're looking for doesn't exist.
        </p>

        {/* Single primary action */}
        <button
          type="button"
          onClick={()=>navigate("/")}
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 active:scale-[0.99] sm:w-auto"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
            <path d="M9 22V12h6v10" />
          </svg>
          Go to Home
        </button>
      </div>
    </main>
  )
}

export default NotFound
