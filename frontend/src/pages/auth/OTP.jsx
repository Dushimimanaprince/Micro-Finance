import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";

const OTP = () => {
    const [formData, setFormData] = useState({ email: "", code: "" })
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            await API.post(`auth/verify-otp/`, formData)
            navigate("/login")
        } catch (err) {
            setError(err.response?.data?.error ?? "Failed to verify")
        } finally {
            setLoading(false)
        }
    }

    const handleResend = async () => {
        if (!formData.email) {
            setError("Please enter your email first")
            return
        }
        setLoading(true)
        setError("")
        try {
            await API.post(`auth/resend-otp/`, { email: formData.email })
            setSuccess("New code sent to your email")
        } catch (err) {
            setError(err.response?.data?.error ?? "Failed to resend")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 text-[#e5e5e5]">
            <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-8 w-full max-w-lg shadow-2xl">
                <h2 className='text-3xl font-semibold mb-6 text-white text-center'>Verify Email</h2>

                {error && (
                    <div className='bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm'>
                        {error}
                    </div>
                )}

                {success && (
                    <div className='bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded-lg mb-4 text-sm'>
                        {success}
                    </div>
                )}

                <form className='space-y-4' onSubmit={handleSubmit}>
                    <div>
                        <label className='block text-sm font-medium text-[#888888] mb-1'>Email</label>
                        <input type="email" name="email" value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors"
                            required />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-[#888888] mb-1'>Verification Code</label>
                        <input type="text" name="code" value={formData.code}
                            onChange={handleChange}
                            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors"
                            required />
                    </div>

                    <button type='submit' disabled={loading}
                        className='w-full bg-blue-900 text-white font-semibold rounded-lg p-3 hover:bg-blue-800 transition-colors mt-6'>
                        {loading ? "Verifying..." : "Verify"}
                    </button>

                    <button type='button' onClick={handleResend} disabled={loading}
                        className='w-full bg-teal-900 text-white font-semibold rounded-lg p-3 hover:bg-teal-800 transition-colors'>
                        {loading ? "Sending..." : "Resend Code"}
                    </button>
                </form>

                <p className="text-sm text-[#666666] text-center mt-4">
                    Go Back to{" "}
                    <Link to="/signup" className="text-[#e5e5e5] hover:underline">Signup</Link>
                </p>
            </div>
        </div>
    )
}

export default OTP