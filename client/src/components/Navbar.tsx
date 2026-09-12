import { Link, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import LogoutButton from './LogoutButton'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const {user} = useAuth()

  // Close the dropdown when clicking anywhere outside of it.
  useEffect(() => {
    if (!menuOpen) return
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  if (!user) {
    return <div>Error</div>
  }

  const linkClass = (active: boolean) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-100 ${active ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'
    }`

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
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
              <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
              <path d="M16 12h.01" />
              <path d="M3 9h18" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight text-slate-900">
            PayWallet
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-1 sm:flex">
          <Link to="/" className={linkClass(pathname === '/')}>
            Dashboard
          </Link>
          <Link to="/send" className={linkClass(pathname === '/send')}>
            Send
          </Link>
          <Link
            to="/add-money"
            className={linkClass(pathname === '/add-money')}
          >
            Add Money
          </Link>
          <Link
            to="/transactions"
            className={linkClass(pathname === '/transactions')}
          >
            Transactions
          </Link>
        </nav>

        {/* User */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex items-center gap-2.5 rounded-lg py-1.5 pl-1.5 pr-2 transition-colors hover:bg-slate-100"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
              S
            </span>
            <span className="hidden text-sm font-medium text-slate-700 sm:block">
              {user.username}
            </span>
            <svg
              className={`h-4 w-4 text-slate-400 transition-transform ${menuOpen ? 'rotate-180' : ''
                }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-1 shadow-lg"
            >
              <LogoutButton/>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
