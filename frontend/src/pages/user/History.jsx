import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";


const History = () =>{

    const [transactions,setTransactions]= useState([])
    const [error,setError]= useState("")
    const [loading,setLoading]= useState(true)

    const navigate= useNavigate()


    useEffect(()=>{

        const fetchTransactions = async () =>{

            try{
                const response = await API.get('transactions/history/')
                setTransactions(response.data)
            } catch (err) {
                setError("Failed to load Transaactions")
            } finally {
                setLoading(false)
            }

        }
        fetchTransactions()
    },[])


    if (loading) return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            <p className="text-zinc-500 text-sm">Loading...</p>
        </div>
    )

    if (error) return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            <p className="text-zinc-500 text-sm">{error}</p>
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
                    <h1 className="text-white font-medium text-sm">All Transactions</h1>
                    <p className="text-zinc-500 text-xs">User Transactions</p>
                </div>
            </nav>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                                <th className="text-left px-6 py-4">Transaction ID</th>
                                <th className="text-left px-6 py-4">Amount</th>
                                <th className="text-left px-6 py-4">Status</th>
                                <th className="text-left px-6 py-4">Reason</th>
                                <th className="text-left px-6 py-4">Transaction At</th>

                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {transactions.map(trans => (
                                <tr key={trans.id} className="hover:bg-zinc-800/50 transition-colors">
                                    <td className="px-6 py-4 text-zinc-600">{trans.id}</td>
                                    <td className="px-6 py-4 text-green-400 font-medium">$ {Number(trans.amount).toLocaleString('en-us',{
                                                                                        minimumFractionDigits: 2,
                                                                                        maximumFractionDigits: 2
                                    })}</td>
                                    <td className="px-6 py-4 text-blue-400">{trans.sender_username}</td>
                                    <td className="px-6 py-4 text-blue-400">{trans.purpose}</td>
                                    <td className="px-6 py-4 text-zinc-500 text-xs">
                                        {new Date(trans.transaction_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
            </div>
        </div>
    )

}

export default History