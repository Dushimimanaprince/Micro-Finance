import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";


const Users = () => {

    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [editUser, setEditUser] = useState(null)
    const [editForm, setEditForm] = useState({
        username: "", first_name: "", last_name: "", email: "", phone: ""
    })
    const [editLoading, setEditLoading] = useState(false)
    const [editError, setEditError] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await API.get(`users/`)
                setUsers(response.data)
            } catch (err) {
                setError("Failed to load Users")
            } finally {
                setLoading(false)
            }
        }
        fetchUsers()
    }, [])

    const handleToggleUser = async (userId) => {
        try {
            await API.put(`users/toggle/${userId}/`)
            setUsers(prev =>
                prev.map(u => u.id === userId
                    ? { ...u, is_active: !u.is_active }
                    : u
                )
            )
        } catch (err) {
            setError(err.response?.data?.error || "An error occurred")
        }
    }
    const handleSetUser = async (userId) => {
        try {
            await API.put(`users/set/${userId}/`)
            setUsers(prev =>
                prev.map(u => u.id === userId
                    ? { ...u, is_superuser: !u.is_superuser }
                    : u
                )
            )
        } catch (err) {
            setError(err.response?.data?.error || "An error occurred")
        }
    }

    const handleEditOpen = (user) => {
        setEditUser(user)
        setEditForm({
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone
        })
        setEditError("")
    }

    const handleEditChange = (e) => {
        const { name, value } = e.target
        setEditForm(prev => ({ ...prev, [name]: value }))
    }

    const handleEditSubmit = async (e) => {
        e.preventDefault()
        setEditLoading(true)
        setEditError("")
        try {
            await API.put(`users/${editUser.id}/`, editForm)
            setUsers(prev =>
                prev.map(u => u.id === editUser.id
                    ? { ...u, ...editForm }
                    : u
                )
            )
            setEditUser(null)
        } catch (err) {
            setEditError(err.response?.data?.error ?? "Failed to update user")
        } finally {
            setEditLoading(false)
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            <p className="text-zinc-500 text-sm">Loading...</p>
        </div>
    )

    if (error) return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
            </div>
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
                    <h1 className="text-white font-medium text-sm">User Management</h1>
                    <p className="text-zinc-500 text-xs">Manage and toggle users</p>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-8">

                <div className="flex items-center gap-2 mb-6">
                    <span className="text-lg">👨‍🎓</span>
                    <h2 className="text-white font-semibold text-sm">Users</h2>
                    <span className="text-xs text-zinc-500 bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded-full">
                        {users.length}
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
                                <th className="text-left px-6 py-4">Role</th>
                                <th className="text-left px-6 py-4">Status</th>
                                <th className="text-left px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-zinc-800/50 transition-colors">
                                    <td className="px-6 py-4 text-white font-medium">{user.username}</td>
                                    <td className="px-6 py-4 text-zinc-300">{user.first_name} {user.last_name}</td>
                                    <td className="px-6 py-4 text-zinc-400">{user.email}</td>
                                    <td className="px-6 py-4 text-zinc-400">{user.phone}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-3 py-1 rounded-full border ${
                                            user.is_superuser
                                                ? "bg-purple-900/30 border-purple-700 text-purple-400"
                                                : "bg-zinc-800 border-zinc-700 text-zinc-400"
                                        }`}>
                                            {user.is_superuser ? "Admin" : "User"}
                                        </span>
                                    </td>
                                    <td className=" py-4">
                                        <span className={`text-xs px-3 py-1 rounded-full border ${
                                            user.is_active
                                                ? "bg-green-900/30 border-green-700 text-green-400"
                                                : "bg-red-900/30 border-red-700 text-red-400"
                                        }`}>
                                            {user.is_active ? "● Active" : "● Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleSetUser(user.id)}
                                                className={`text-xs px-1 py-1.5 rounded-lg border transition-all ${
                                                    user.is_superuser
                                                        ? "bg-purple-900/30 border-purple-700 text-purple-400"
                                                        : "bg-zinc-800 border-zinc-700 text-zinc-400"
                                                }`}>
                                                {user.is_superuser ? "Super" : "Regular"}
                                            </button>
                                            <button
                                                onClick={() => handleToggleUser(user.id)}
                                                className={`text-xs px-1 py-1.5 rounded-lg border transition-all ${
                                                    user.is_active
                                                        ? "bg-red-900/30 border-red-700 text-red-400 hover:bg-red-900/50"
                                                        : "bg-green-900/30 border-green-700 text-green-400 hover:bg-green-900/50"
                                                }`}>
                                                {user.is_active ? "Deactivate" : "Activate"}
                                            </button>
                                            <button
                                                onClick={() => handleEditOpen(user)}
                                                className="text-xs px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-all">
                                                Edit
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {editUser && (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-white">Edit User</h2>
                <button onClick={() => setEditUser(null)}
                    className="text-zinc-500 hover:text-white text-xl">✕</button>
            </div>

            {editError && (
                            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm">
                                {editError}
                            </div>
                        )}

                        <form className="space-y-4" onSubmit={handleEditSubmit}>
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">Username</label>
                                <input type="text" name="username" value={editForm.username}
                                    onChange={handleEditChange}
                                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-zinc-100 focus:outline-none focus:border-zinc-500 transition-colors text-sm"
                                    required />
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label className="block text-xs text-zinc-400 mb-1">First Name</label>
                                    <input type="text" name="first_name" value={editForm.first_name}
                                        onChange={handleEditChange}
                                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-zinc-100 focus:outline-none focus:border-zinc-500 transition-colors text-sm" />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs text-zinc-400 mb-1">Last Name</label>
                                    <input type="text" name="last_name" value={editForm.last_name}
                                        onChange={handleEditChange}
                                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-zinc-100 focus:outline-none focus:border-zinc-500 transition-colors text-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">Email</label>
                                <input type="email" name="email" value={editForm.email}
                                    onChange={handleEditChange}
                                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-zinc-100 focus:outline-none focus:border-zinc-500 transition-colors text-sm"
                                    required />
                            </div>
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">Phone</label>
                                <input type="text" name="phone" value={editForm.phone}
                                    onChange={handleEditChange}
                                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-zinc-100 focus:outline-none focus:border-zinc-500 transition-colors text-sm"
                                    required />
                            </div>
                            <button type="submit" disabled={editLoading}
                                className="w-full bg-blue-900 text-white font-semibold rounded-lg p-3 hover:bg-blue-800 transition-colors">
                                {editLoading ? "Saving..." : "Save Changes"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Users