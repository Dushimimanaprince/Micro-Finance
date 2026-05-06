import { useEffect, useState } from "react";
import API from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";



const Signup = () => {

    const [formData, setFormData]= useState({
        first_name:"",last_name:"",username:"",email:"",phone:"",
        password:""
    })
    const [error,setError]= useState("")
    const [loading, setLoading] = useState(false)

    const navigate=useNavigate()

    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.name]:e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
        await API.post(`auth/register/`,formData)
        navigate("/verify/code")
        }catch (err){
            setError(err.response?.data?.error ?? "Failed to Register user")
        } finally {
            setLoading(false)
        }
    }


    return(
        <div className='min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 text-[#e5e5e5]'>
            <div className='bg-[#141414] border border-[#1f1f1f] rounded-2xl p-8 w-full max-w-lg shadow-2xl'>
                <h2 className='text-3xl font-semibold mb-6 text-white text-center'>Register Form</h2>
                {error && (
                    <div className='"bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm'>
                        {error}
                    </div>
                )}


                <form className='space-y-4' onSubmit={handleSubmit}>

                    <div>
                        <label className='block text-sm font-medium text-[#888888] mb-1'>First Name</label>
                        <input type="text" name="first_name" value={formData.first_name}
                        onChange={handleChange} required 
                        className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors"
                        required/>
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-[#888888] mb-1'>Last Name</label>
                        <input type="text" name="last_name" value={formData.last_name}
                        onChange={handleChange} 
                        className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors"
                         required/>
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-[#888888] mb-1'>Username</label>
                        <input type="text" name="username" value={formData.username}
                        onChange={handleChange} 
                        className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors"
                         required/>
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-[#888888] mb-1'>Email</label>
                        <input type="email" name="email" value={formData.email}
                        onChange={handleChange} 
                        className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors"
                        required/>
                    </div>
                    
                    <div>
                        <label className='block text-sm font-medium text-[#888888] mb-1'>Phone Number</label>
                        <input type="number" name="phone" value={formData.phone}
                        onChange={handleChange} 
                        className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors"
                        required/>
                    </div>

                        <div>
                        <label className='block text-sm font-medium text-[#888888] mb-1'>Password</label>
                        <input type="password" name="password" value={formData.password}
                        onChange={handleChange} 
                        className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors"
                        required/>
                    </div>


                    <button type='submit' 
                        className='w-full bg-blue-900 text-[#0a0a0a] font-semibold rounded-lg p-3 hover:bg-[#e5e5e5] transition-colors mt-6'>
                            {loading ? "Registering..." : "Register"}
                    </button>

                </form>


            </div>
        </div>
    )

}

export default Signup;