import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";


const Dashboard = () => {

    const [error, setError] = useState("")
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showTransfer, setShowTransfer] = useState(false)
    const [transferError, setTransferError] = useState("")
    const [transferLoading, setTransferLoading] = useState(false)
    const [stats, setStats] = useState({ wallet: 0, loan: null })
    const [formData, setFormData] = useState({ username: "", amount: "" })

    const navigate = useNavigate()

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [userData, userWallet, loanWallet] = await Promise.all([
                    API.get("auth/me/"),
                    API.get("wallets/"),
                    API.get("wallets/loan/"),
                ])
                setUser(userData.data)
                setStats({
                    wallet: userWallet.data.balance,
                    loan: loanWallet.data
                })
            } catch (err) {
                setError("Failed to load user data")
                navigate("/login")
            } finally {
                setLoading(false)
            }
        }
        fetchAll()
    }, [])

    const handleLogout = () => {
        localStorage.clear()
        navigate("/login")
    }

    const handleFormChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleTransferSubmit = async (e) => {
        e.preventDefault()
        setTransferLoading(true)
        setTransferError("")
        try {
            await API.post("transactions/transfer/", formData)
            setShowTransfer(false)
            setFormData({ username: "", amount: "" })
            const updated = await API.get("wallets/")
            setStats(prev => ({ ...prev, wallet: updated.data.balance }))
        } catch (err) {
            setTransferError(err.response?.data?.error ?? "Transfer failed")
        } finally {
            setTransferLoading(false)
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-[#e5e5e5]">
            Loading...
        </div>
    )

    if (error) return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-red-400">
            {error}
        </div>
    )

    const statCards = [
        { label: "Balance", value: stats.wallet, icon: "💸", color: "border-blue-800 bg-blue-900/20" },
        ...(stats.loan ? [{ label: "Loan Balance", value: stats.loan.loan_balance, icon: "🏦", color: "border-red-800 bg-red-900/20" }] : [])
    ]

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5] space-y-10 p-10">

            {/* Header */}
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <h1 className="text-lg font-semibold text-white tracking-tight">User Dashboard</h1>
                <button onClick={handleLogout}
                    className="text-sm bg-red-900 text-[#888888] border border-[#2a2a2a] px-4 py-2 rounded-lg hover:border-[#555555] hover:text-[#e5e5e5] transition-colors">
                    Logout
                </button>
            </div>

            {/* Profile + Stats */}
            <div className="max-w-7xl mx-auto flex gap-6">

                {/* Left - Profile Card */}
                <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-6 w-80 shrink-0">
                    <h2 className="text-xl font-semibold mb-4 text-white">Profile</h2>
                    <div className="space-y-3 text-sm text-[#888888]">
                        <div className="flex justify-between">
                            <span>Username</span>
                            <span className="text-[#e5e5e5]">{user?.username}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>First Name</span>
                            <span className="text-[#e5e5e5]">{user?.first_name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Last Name</span>
                            <span className="text-[#e5e5e5]">{user?.last_name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Email</span>
                            <span className="text-[#e5e5e5]">{user?.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Phone</span>
                            <span className="text-[#e5e5e5]">{user?.phone}</span>
                        </div>
                    </div>
                </div>

                {/* Right - Stats */}
                <div className="flex-1">
                    <h2 className="text-base font-semibold text-white mb-5">Overview</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {statCards.map(({ label, value, icon, color }) => (
                            <div key={label}
                                className={`border rounded-2xl p-6 flex items-center gap-4 ${color}`}>
                                <div className="text-4xl">{icon}</div>
                                <div>
                                    <p className="text-3xl font-bold text-white">{value}</p>
                                    <p className="text-sm text-[#888888] mt-0.5">{label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="max-w-7xl mx-auto flex gap-4">
                <button onClick={() => setShowTransfer(true)}
                    className="flex items-center gap-2 bg-blue-900 hover:bg-blue-950 text-white text-sm font-medium px-5 py-3 rounded-xl border border-blue-700 hover:border-blue-600 transition-all shadow-lg shadow-blue-900/30">
                    📝 Transfer Money
                </button>
            </div>

            {/* Transfer Modal */}
            {showTransfer && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-8 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-white">Transfer Money</h2>
                            <button onClick={() => setShowTransfer(false)}
                                className="text-[#888888] hover:text-white text-xl">✕</button>
                        </div>

                        {transferError && (
                            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm">
                                {transferError}
                            </div>
                        )}

                        <form className="space-y-4" onSubmit={handleTransferSubmit}>
                            <div>
                                <label className="block text-sm font-medium text-[#888888] mb-1">Recipient Username</label>
                                <input type="text" name="username" value={formData.username}
                                    onChange={handleFormChange}
                                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors"
                                    required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#888888] mb-1">Amount</label>
                                <input type="number" name="amount" value={formData.amount}
                                    onChange={handleFormChange}
                                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors"
                                    required />
                            </div>
                            <button type="submit" disabled={transferLoading}
                                className="w-full bg-blue-900 text-white font-semibold rounded-lg p-3 hover:bg-blue-800 transition-colors mt-2">
                                {transferLoading ? "Sending..." : "Send Money"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    )
}

export default Dashboard