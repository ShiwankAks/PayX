import { useNavigate } from "react-router-dom"

/**
 * Logout UI only. The actual logout logic (clearing session/JWT, redirect,
 * API call, etc.) is passed in via `onClick` and wired up later.
 */
function LogoutButton() {
  const navigate = useNavigate()

  const logout=()=>{
    localStorage.removeItem("token")
    navigate("/login")
  }


  return (
    <button
      type="button"
      onClick={logout}
      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-red-600"
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
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="m16 17 5-5-5-5" />
        <path d="M21 12H9" />
      </svg>
      Logout
    </button>
  )
}

export default LogoutButton
