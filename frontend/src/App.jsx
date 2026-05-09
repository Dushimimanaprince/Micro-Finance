import { BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import Signup from "./pages/auth/Signup";
import OTP from "./pages/auth/Otp";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/user/Dashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";


function App(){
    return(
        <BrowserRouter>

            <Routes>
                <Route path="/" element={<Navigate to="/login"/>} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/verify/code" element={<OTP />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>

        </BrowserRouter>
    )
}

export default App 