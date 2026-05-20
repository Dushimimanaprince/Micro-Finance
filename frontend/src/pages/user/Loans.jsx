import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const Loans = () => {
    const [loans, setLoans] = useState([])
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)
    const [showRequest, setShowRequest] = useState(false)
    const [showRepay, setShowRepay] = useState(false)
    const [selectedLoan, setSelectedLoan] = useState(null)
    const [form, setForm] = useState({ amount: "", reason: "" })
    const [repayAmount, setRepayAmount] = useState("")
    const [loanLoading, setLoanLoading] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        const fetchLoans = async () => {
            try {
                const response = await API.get(`wallets/loan/request/`)
                setLoans(response.data)
            } catch (err) {
                setError("Failed to load loans")
            } finally {
                setLoading(false)
            }
        }
        fetchLoans()
    }, [])

    const handleFormChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleLoanSubmit = async (e) => {
        e.preventDefault()
        setLoanLoading(true)
        setError("")
        try {
            const response = await API.post(`wallets/loan/request/`, form)
            setLoans(prev => [...prev, response.data])
            setShowRequest(false)
            setForm({ amount: "", reason: "" })
        } catch (err) {
            setError(err.response?.data?.error ?? "Failed to request loan")
        } finally {
            setLoanLoading(false)
        }
    }

    const handleRepaySubmit = async (e) => {
        e.preventDefault()
        setLoanLoading(true)
        setError("")
        try {
            await API.post(`wallets/loan/repay/`, { amount: repayAmount })
            setShowRepay(false)
            setRepayAmount("")
            const response = await API.get(`wallets/loan/request/`)
            setLoans(response.data)
        } catch (err) {
            setError(err.response?.data?.error ?? "Failed to repay loan")
        } finally {
            setLoanLoading(false)
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            <p className="text-zinc-500 text-sm">Loading...</p>
        </div>
    )

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            <nav className="border-b border-zinc-800 px-6 py-4 flex items-center gap-3">
                <button onClick={() => navigate("/dashboard")}
                    className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div>
                    <h1 className="text-white font-medium text-sm">My Loans</h1>
                    <p className="text-zinc-500 text-xs">Request and repay loans</p>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-8">
                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">🏦</span>
                        <h2 className="text-white font-semibold text-sm">Loans</h2>
                        <span className="text-xs text-zinc-500 bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded-full">
                            {loans.length}
                        </span>
                    </div>
                    <button onClick={() => setShowRequest(true)}
                        className="text-xs px-4 py-2 bg-blue-900 border border-blue-700 text-blue-300 rounded-lg hover:bg-blue-800 transition-all">
                        + Request Loan
                    </button>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                                <th className="text-left px-6 py-4">Amount</th>
                                <th className="text-left px-6 py-4">Reason</th>
                                <th className="text-left px-6 py-4">Status</th>
                                <th className="text-left px-6 py-4">Requested At</th>
                                <th className="text-left px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {loans.map(loan => (
                                <tr key={loan.id} className="hover:bg-zinc-800/50 transition-colors">
                                    <td className="px-6 py-4 text-green-400 font-medium">$ {Number(loan.loan_balance).toLocaleString('en-us',{
                                                                                        minimumFractionDigits: 2,
                                                                                        maximumFractionDigits: 2
                                    })}</td>
                                    <td className="px-6 py-4 text-zinc-400">{loan.reason}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-3 py-1 rounded-full border ${
                                            loan.status === "approved" ? "bg-green-900/30 border-green-700 text-green-400" :
                                            loan.status === "rejected" ? "bg-red-900/30 border-red-700 text-red-400" :
                                            loan.status === "closed" ? "bg-zinc-800 border-zinc-700 text-zinc-400" :
                                            "bg-yellow-900/30 border-yellow-700 text-yellow-400"
                                        }`}>
                                            {loan.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-500 text-xs">
                                        {new Date(loan.requested_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {loan.status === "approved" && (
                                            <button
                                                onClick={() => { setSelectedLoan(loan); setShowRepay(true) }}
                                                className="text-xs px-3 py-1.5 rounded-lg border bg-green-900/30 border-green-700 text-green-400 hover:bg-green-900/50">
                                                Repay
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showRequest && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
                        {error && (
                            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm">
                                {error}
                            </div>
                        )}
                            <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-white">Request a Loan</h2>
                            <button onClick={() => setShowRequest(false)} className="text-zinc-500 hover:text-white text-xl">✕</button>
                        </div>
                        <form className="space-y-4" onSubmit={handleLoanSubmit}>
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">Amount</label>
                                <input type="number" name="amount" value={form.amount}
                                    onChange={handleFormChange}
                                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-zinc-100 focus:outline-none focus:border-zinc-500 text-sm"
                                    required />
                            </div>
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">Reason</label>
                                <textarea name="reason" value={form.reason}
                                    onChange={handleFormChange}
                                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-zinc-100 focus:outline-none focus:border-zinc-500 text-sm h-24 resize-none"
                                    required />
                            </div>
                            <button type="submit" disabled={loanLoading}
                                className="w-full bg-blue-900 text-white font-semibold rounded-lg p-3 hover:bg-blue-800 transition-colors">
                                {loanLoading ? "Requesting..." : "Request Loan"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Repay Loan Modal */}
            {showRepay && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-white">Repay Loan</h2>
                            <button onClick={() => setShowRepay(false)} className="text-zinc-500 hover:text-white text-xl">✕</button>
                        </div>
                        <form className="space-y-4" onSubmit={handleRepaySubmit}>
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">Amount to Repay</label>
                                <input type="number" value={repayAmount}
                                    onChange={(e) => setRepayAmount(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-zinc-100 focus:outline-none focus:border-zinc-500 text-sm"
                                    required />
                            </div>
                            <button type="submit" disabled={loanLoading}
                                className="w-full bg-green-900 text-white font-semibold rounded-lg p-3 hover:bg-green-800 transition-colors">
                                {loanLoading ? "Processing..." : "Repay"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Loans