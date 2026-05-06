import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import {jwtDecode} from "jwt-decode"


const Login = () => {

    const[formData, setFormData]= useState({
        username:"",password:""
    })
    const[error,setError]= useState("")
    const navigate= useNavigate();

    const handleChange = (e)=> {
        setFormData({
            ...formData, [e.target.name]:e.target.value
        })
    }

    const handleSubmit= async(e)=> {
        e.preventDefault()
        try{
            const response= await API.post(`auth/login/`,formData)
            const data= response.data

            localStorage.setItem("access",data.access)
            localStorage.setItem("refresh",data.refresh)

            const decode = jwtDecode(data.access)

            if (decode.is_superuser){
                navigate("/admin/dashboard")
            }else{
                navigate("/dashboard")
            }

        }catch (err){
            setError(err.response?.data?.error ?? "Failed to Login")
        } 

    }

    return(

        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 text-[#e5e5e5]">
            <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-8 w-full max-w-lg shadow-2xl">
                <h2 className='text-3xl font-semibold mb-6 text-white text-center'>Signin</h2>
                {error && (
                    <div className='"bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm'>
                        {error}
                    </div>
                )}

                <form className='space-y-4' onSubmit={handleSubmit}>

                    <div>
                        <label className='block text-sm font-medium text-[#888888] mb-1'>Username</label>
                        <input type="text" name="username" value={formData.username}
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
                            Verify
                    </button>

                </form>
                <p className="text-sm text-[#666666] text-center mt-4">
                    Already Have an Account?{" "}
                    <Link to="/signup" className="text-[#e5e5e5] hover:underline">
                        Signup
                    </Link>
                </p>
            </div>
        </div>

    )
}

export default Login;