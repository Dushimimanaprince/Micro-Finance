import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const AdminLoans = () => {
    const [loans, setLoans] = useState([])
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {
        const fetchLoans = async () => {
            try {
                const response = await API.get(`wallets/loan/approve/`)
                setLoans(response.data)
            } catch (err) {
                setError("Failed to load loans")
            } finally {
                setLoading(false)
            }
        }
        fetchLoans()
    }, [])

    const handleApprove = async (loanId) => {
        try {
            await API.post(`wallets/loan/approve/${loanId}/`)
            setLoans(prev => prev.filter(l => l.id !== loanId))
        } catch (err) {
            setError(err.response?.data?.error || "Could not approve loan")
        }
    }

    const handleReject = async (loanId) => {
        try {
            await API.delete(`wallets/loan/approve/${loanId}/`)
            setLoans(prev => prev.filter(l => l.id !== loanId))
        } catch (err) {
            setError(err.response?.data?.error || "Could not reject loan")
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
                <button onClick={() => navigate("/admin/dashboard")}
                    className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div>
                    <h1 className="text-white font-medium text-sm">Loan Requests</h1>
                    <p className="text-zinc-500 text-xs">Approve or reject user loan requests</p>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-8">
                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <div className="flex items-center gap-2 mb-6">
                    <span className="text-lg">🏦</span>
                    <h2 className="text-white font-semibold text-sm">Pending Loans</h2>
                    <span className="text-xs text-zinc-500 bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded-full">
                        {loans.length}
                    </span>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                                <th className="text-left px-6 py-4">Username</th>
                                <th className="text-left px-6 py-4">Full Name</th>
                                <th className="text-left px-6 py-4">Email</th>
                                <th className="text-left px-6 py-4">Phone</th>
                                <th className="text-left px-6 py-4">Amount</th>
                                <th className="text-left px-6 py-4">Reason</th>
                                <th className="text-left px-6 py-4">Status</th>
                                <th className="text-left px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {loans.map(loan => (
                                <tr key={loan.id} className="hover:bg-zinc-800/50 transition-colors">
                                    <td className="px-6 py-4 text-white font-medium">{loan.username}</td>
                                    <td className="px-6 py-4 text-zinc-300">{loan.first_name} {loan.last_name}</td>
                                    <td className="px-6 py-4 text-zinc-400">{loan.email}</td>
                                    <td className="px-6 py-4 text-zinc-400">{loan.phone}</td>
                                    <td className="px-6 py-4 text-green-400 font-medium">$ {loan.amount}</td>
                                    <td className="px-6 py-4 text-zinc-400">{loan.reason}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-3 py-1 rounded-full border ${
                                            loan.status === "approved" ? "bg-green-900/30 border-green-700 text-green-400" :
                                            loan.status === "rejected" ? "bg-red-900/30 border-red-700 text-red-400" :
                                            "bg-yellow-900/30 border-yellow-700 text-yellow-400"
                                        }`}>
                                            {loan.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {loan.status === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(loan.id)}
                                                        className="text-xs px-3 py-1.5 rounded-lg border bg-green-900/30 border-green-700 text-green-400 hover:bg-green-900/50 transition-all">
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(loan.id)}
                                                        className="text-xs px-3 py-1.5 rounded-lg border bg-red-900/30 border-red-700 text-red-400 hover:bg-red-900/50 transition-all">
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AdminLoans