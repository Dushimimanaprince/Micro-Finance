import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const Requests = () =>{

    const [requests,setRequests]=useState([])
    const [userRequests,setUserRequests]=useState([])
    const [error,setError]=useState("")
    const [loading,setLoading]= useState(true)
    const [showRequest,setShowRequest]= useState(false)
    const [requestloading,setRequestloading]= useState(false)
    const [requestError,setRequestError]= useState("")
    const [success, setshowSuccess]= useState("")
    const [formData,setFormData]= useState({
        user:"",amount:"",purpose:""
    })

    const navigate= useNavigate()


    useEffect (()=>{

        const fetchRequest= async () =>{

            try{
                const [response,user]= await Promise.all([
                    API.get(`transactions/requests/`),
                    API.get(`transactions/requests/users/`)
                ])
                setRequests(response.data)
                setUserRequests(user.data)
            }catch(err){
                setError("Failed to Load Requests")
            }finally{
                setLoading(false)
            }
        }

        fetchRequest()
    },[])

    const handleFormChange = (e) => {
        const {name,value} = e.target
        setFormData(prev => ({...prev, [name]: value}))
    }

    const handleRequestSubmit= async (e) => {
        e.preventDefault()
        setRequestloading(true)
        setRequestError("")
        setshowSuccess("")

        try{
            const response =await API.post(`transactions/requests/`,formData)
            setshowSuccess(response.data.message)
            setFormData({username:"",amount:"",purpose:""})
        }catch(err){
            setRequestError(err.response?.data?.error ?? "Failed to Request Funds")
        }finally{
            setRequestloading(false)
        }

    }

    const handleApproveRequest = async (requestId) => {
        try {
            await API.post(`transactions/requests/${requestId}/approve/`)
            setRequests(prev => prev.map(r => r.id === requestId
                ? { ...r, status: "paid" }
                : r
            ))
        } catch (err) {
            setError(err.response?.data?.error ?? "Couldn't Approve Request")
        }
    }

    const handleRejectRequest = async (requestId) => {
        try {
            await API.delete(`transactions/requests/${requestId}/decline/`)
            setRequests(prev => prev.map(r => r.id === requestId
                ? { ...r, status: "declined" }
                : r
            ))
        } catch (err) {
            setError(err.response?.data?.error ?? "Couldn't Reject Request")
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


    return(
        <div className="min-h-screen bg-zinc-950 text-zinc-100">

            <nav className="border-b border-zinc-800 px-6 py-4 flex items-center gap-3">
                <button onClick={() => navigate("/dashboard")}
                    className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div>
                    <h1 className="text-white font-medium text-sm">My Request</h1>
                    <p className="text-zinc-500 text-xs">Request and Repay</p>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-8 space-y-20">
                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">🏦</span>
                        <h2 className="text-white font-semibold text-sm">Requests</h2>
                        <span className="text-xs text-zinc-500 bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded-full">
                            {requests.length}
                        </span>
                    </div>
                    <button onClick={() => setShowRequest(true)}
                        className="text-xs px-4 py-2 bg-blue-900 border border-blue-700 text-blue-300 rounded-lg hover:bg-blue-800 transition-all">
                        + Request Funds
                    </button>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                                <th className="text-left px-6 py-4">Amount</th>
                                <th className="text-left px-6 py-4">Requester</th>
                                <th className="text-left px-6 py-4">Reason</th>
                                <th className="text-left px-6 py-4">Status</th>
                                <th className="text-left px-6 py-4">Requested At</th>
                                <th className="text-left px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {requests.map(request => (
                                <tr key={request.id} className="hover:bg-zinc-800/50 transition-colors">
                                    <td className="px-6 py-4 text-green-400 font-medium">$ {Number(request.amount).toLocaleString('en-us',{
                                                                                        minimumFractionDigits: 2,
                                                                                        maximumFractionDigits: 2
                                    })}</td>
                                    <td className="px-6 py-4 text-zinc-400">{request.requester_username}</td>
                                    <td className="px-6 py-4 text-blue-400">{request.purpose}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-3 py-1 rounded-full border ${
                                            request.status === "pending" ? "bg-yellow-900/30 border-yellow-700 text-yellow-400" :
                                            request.status === "paid" ? "bg-green-900/30 border-green-700 text-green-400" :
                                            request.status === "declined" ? "bg-red-800 border-red-700 text-red-300" :
                                            "bg-blue-900/30 border-blue-700 text-blue-400"
                                        }`}>
                                            {request.status?.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-500 text-xs">
                                        {new Date(request.request_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                            {request.status === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() => handleApproveRequest(request.id)}
                                                        className="text-xs px-3 py-1.5 rounded-lg border bg-green-900/30 border-green-700 text-green-400 hover:bg-green-900/50 transition-all">
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectRequest(request.id)}
                                                        className="text-xs px-3 py-1.5 rounded-lg border bg-red-900/30 border-red-700 text-red-400 hover:bg-red-900/50 transition-all">
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>




                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <span className="text-lg"></span>
                        <h2 className="text-white font-semibold text-sm">My Requests</h2>
                        <span className="text-xs text-zinc-500 bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded-full">
                            {userRequests.length}
                        </span>
                    </div>

                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                                <th className="text-left px-6 py-4">Amount</th>
                                <th className="text-left px-6 py-4">Payer</th>
                                <th className="text-left px-6 py-4">Reason</th>
                                <th className="text-left px-6 py-4">Status</th>
                                <th className="text-left px-6 py-4">Requested At</th>

                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {userRequests.map(request => (
                                <tr key={request.id} className="hover:bg-zinc-800/50 transition-colors">
                                    <td className="px-6 py-4 text-green-400 font-medium">$ {Number(request.amount).toLocaleString('en-us',{
                                                                                        minimumFractionDigits: 2,
                                                                                        maximumFractionDigits: 2
                                    })}</td>
                                    <td className="px-6 py-4 text-zinc-400">{request.payer_username}</td>
                                    <td className="px-6 py-4 text-blue-400">{request.purpose}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-3 py-1 rounded-full border ${
                                            request.status === "pending" ? "bg-yellow-900/30 border-yellow-700 text-yellow-400" :
                                            request.status === "paid" ? "bg-green-900/30 border-green-700 text-green-400" :
                                            request.status === "declined" ? "bg-red-800 border-red-700 text-red-400" :
                                            "bg-blue-900/30 border-blue-700 text-blue-400"
                                        }`}>
                                            {(request.status).toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-500 text-xs">
                                        {new Date(request.request_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>

            {showRequest &&(
                <div className="fixed inset-1 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-8 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-white">Request Funds</h2>
                            <button onClick={() => setShowRequest(false)}
                                    className="text-[#888888] hover:text-white text-xl">❌</button>
                        </div>

                        {requestError && (
                                <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm">
                                    {requestError}
                                </div>
                            )}

                            {success && (
                                <div className="bg-green-900/50 border border-green-500 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm">
                                    {success}
                                </div>

                            )}

                            <form className="space-y-4" onSubmit={handleRequestSubmit}>
                                        <div>
                                            <label className="block text-sm font-medium text-[#888888] mb-1">Payer Username</label>
                                            <input type="text" name="payer" value={formData.username}
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

                                        <div>
                                            <label className="block text-sm font-medium text-[#888888] mb-1">Purpose</label>
                                                <textarea name="purpose" value={formData.purpose}
                                                        onChange={handleFormChange}
                                                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-zinc-100 focus:outline-none focus:border-zinc-500 text-sm h-24 resize-none"
                                                        required />
                                        </div>
                                        <button type="submit" disabled={requestloading}
                                            className="w-full bg-blue-900 text-white font-semibold rounded-lg p-3 hover:bg-blue-800 transition-colors mt-2">
                                            {requestloading ? "Requesting..." : "Request Funds"}
                                        </button>
                            </form>

                    </div>
                </div>
            )}
        </div>
    )
}

export default Requests;