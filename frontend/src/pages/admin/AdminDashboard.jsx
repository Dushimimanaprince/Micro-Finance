import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"
import API from "../../api/axios";

const AdminDashboard = () => {

    const [admin,setAdmin]= useState(null)
    const [error, setError] = useState("")
    const [loading,setLoading]= useState(true)
    const [user, setusers]= useState([])
    const [depositLoading,setShowDepositLoading]= useState(false)
    const [depositError, setShowDepositError]= useState("")
    const [showDeposit,setShowDeposit]= useState(false)
    const [success, setshowSuccess]= useState("")
    const [stats, setStats]= useState({
        users:0,transactions:0,bank_balance:0
    })
    const [formData, setFormData]= useState({
        username:"",amount:""
    })
    const navigate= useNavigate()


    useEffect(() => {

        const access = localStorage.getItem("access")

        if (!access){
            navigate("/login")
            return
        }

        const decode= jwtDecode(access)

        if(!decode.is_superuser){
            setError("You are unauthorised to use this page")
            navigate("/login")
        }

        const fetchAll= async () => {
            try{
                const[adminData,userData,transactionData,bankData]= await Promise.all([
                    API.get(`auth/me`),
                    API.get(`users/`),
                    API.get(`transactions/history/`),
                    API.get(`wallets/`),
                ])
                setAdmin(adminData.data)
                setusers(userData.data)
                setStats({
                    users: userData.data.length,
                    transactions: transactionData.data.length,
                    bank_balance: bankData.data.balance

                })

            }catch (err){
                setError("Failed to Load Data")
            }finally{
                setLoading(false)
            }
        }

        fetchAll()
    },[])

    const handleLogout = () => {
        localStorage.clear()
        navigate("/login")
    }

    const handleFormChange =(e) => {
        const {name, value}= e.target
        setFormData(prev => ({ ...prev, [name]:value}))
    }
    
    const handleDeposit= async (e) => {

        e.preventDefault()
        setShowDepositLoading(true)
        setShowDepositError("")
        setshowSuccess("")

        try{
            const response= await API.post(`transactions/deposit/`,formData)
            setshowSuccess(response.data.success)
            setFormData({ username: "", amount: "" })
        }catch(err){
            setShowDepositError(err.response?.data?.error ?? "Failed to Deposit")
        }finally{
            setShowDepositLoading(false)
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
        {label:"Total Users", value:stats.users, icon:"👥", color:" border-teal-800 bg-teal-900/20"},
        {label:"Transaction Done", value:stats.users, icon:"📶", color:" border-blue-800 bg-blue-900/40"},
        {label:"Bank Net Profit", value:`$ ${stats.bank_balance}`, icon:"💸", color:" border-green-900 bg-green-950/40"},
    ]

    return (

        <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5] space-y-10 p-10">

            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <h1 className="text-lg font-semibold text-white tracking-tight">Admin Dashboard</h1>
                <button onClick={handleLogout}
                    className="text-sm bg-red-900 text-[#888888] border border-[#2a2a2a] px-4 py-2 rounded-lg hover:border-[#555555] hover:text-[#e5e5e5] transition-colors">
                    Logout
                </button>
            </div>

            <div className="max-w-7xl mx-auto flex gap-9">

                <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-6 w-80 shrink-0">
                    <h2 className="text-xl font-semibold mb-4 text-white">Profile</h2>
                    <div className="space-y-3 text-sm text-[#888888]">
                        <div className="flex justify-between">
                            <span>Username</span>
                            <span className="text-[#e5e5e5]">{admin?.username}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>First Name</span>
                            <span className="text-[#e5e5e5]">{admin?.first_name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Last Name</span>
                            <span className="text-[#e5e5e5]">{admin?.last_name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Email</span>
                            <span className="text-[#e5e5e5]">{admin?.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Phone</span>
                            <span className="text-[#e5e5e5]">{admin?.phone}</span>
                        </div>
                    </div>
                </div>  

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

             <div className="max-w-7xl mx-auto flex gap-4">

                <button onClick={() => navigate("/admin/users")}
                    className="flex items-center gap-2 bg-green-900 hover:bg-green-950 text-white text-sm font-medium px-5 py-3 rounded-xl border border-green-700 hover:border-green-600 transition-all shadow-lg shadow-blue-900/30">
                    🗽 View User Details
                </button>

                <button onClick={() => setShowDeposit(true)}
                    className="flex items-center gap-2 bg-blue-900 hover:bg-blue-950 text-white text-sm font-medium px-5 py-3 rounded-xl border border-blue-700 hover:border-blue-600 transition-all shadow-lg shadow-blue-900/30">
                    ➕ Deposit To User
                </button>

                <button onClick={() => navigate("admin/loans")}
                    className="flex items-center gap-2 bg-purple-900 hover:bg-purple-950 text-white text-sm font-medium px-5 py-3 rounded-xl border border-purple-700 hover:border-purple-600 transition-all shadow-lg shadow-blue-900/30">
                    🔌 Request Loans
                </button>

                <button onClick={() => navigate("admin/loans")}
                    className="flex items-center gap-2 bg-teal-900 hover:bg-teal-950 text-white text-sm font-medium px-5 py-3 rounded-xl border border-teal-700 hover:border-teal-600 transition-all shadow-lg shadow-blue-900/30">
                    🔃 Transaction History
                </button>

                <button onClick={() => navigate("admin/loans")}
                    className="flex items-center gap-2 bg-red-900 hover:bg-red-950 text-white text-sm font-medium px-5 py-3 rounded-xl border border-red-700 hover:border-red-600 transition-all shadow-lg shadow-blue-900/30">
                    🚨 Activate User
                </button>
            </div>

            {showDeposit && (

                <div className="fixed inset-1 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-8 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-white">Deposit Money</h2>
                            <button onClick={() => setShowDeposit(false)}
                                className="text-[#888888] hover:text-white text-xl">❌</button>
                        </div>
                    
                        {depositError && (
                            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm">
                                {depositError}
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-900/50 border border-green-500 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm">
                                {success}
                            </div>

                        )}

                            <form className="space-y-4" onSubmit={handleDeposit}>
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
                                    <button type="submit" disabled={depositLoading}
                                        className="w-full bg-blue-900 text-white font-semibold rounded-lg p-3 hover:bg-blue-800 transition-colors mt-2">
                                        {depositLoading ? "Depositing..." : "Deposit Money"}
                                    </button>
                            </form>
                    </div>
                </div>

                
            )}
        </div>

    )

}

export default AdminDashboard;