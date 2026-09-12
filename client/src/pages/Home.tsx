import BalanceCard from '../components/BalanceCard'
import Navbar from '../components/Navbar'
import QuickActions from '../components/QuickActions'
import RecentTransactions from '../components/RecentTransactions'
import { useAuth } from '../context/AuthContext'

function Home() {

  const {user, loading} = useAuth()
  
  if (loading) {
  return <div>Loading...</div>;
}
  if (!user) {
    return <div>Could not fetch user</div>
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="animate-fade-in space-y-8">
          {/* Greeting */}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Good morning, {user.username}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Here's what's happening with your wallet today.
            </p>
          </div>

          {/* Balance + Quick actions */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <BalanceCard />
            </div>
            <div className="lg:col-span-3">
              <QuickActions />
            </div>
          </div>

          {/* Transactions */}
          <RecentTransactions />
        </div>
      </main>
    </div>
  )
}

export default Home
