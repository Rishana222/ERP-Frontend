import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { setCredentials } from '../store/authSlice';
import { loginService } from '../Utils/LoginAPI'; 
import teamERP from '../assets/group.jpg'; 

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginService({ email, password });
      const { user, token } = response.data;

  
      localStorage.setItem("userInfo", JSON.stringify({ user, token })); 

      dispatch(setCredentials({ user, token }));
      navigate("/"); 
    } catch (error: any) {
      alert(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white rounded-[2rem] shadow-2xl overflow-hidden min-h-[600px]">
        <div className="w-full md:w-1/2 relative bg-slate-900 overflow-hidden">
          <img src={teamERP} alt="ERP" className="absolute inset-0 w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 p-12 flex flex-col justify-end">
            <span className="text-white font-black text-2xl tracking-widest uppercase italic">ERP SYSTEM</span>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-16">
          <form onSubmit={handleLogin} className="space-y-6">
            <h1 className="text-4xl font-black text-slate-800 mb-6">Welcome Back!</h1>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="email" required className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 rounded-2xl outline-none focus:border-blue-500 font-bold" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type={showPassword ? "text" : "password"} required className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 rounded-2xl outline-none focus:border-blue-500 font-bold" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <button type="submit" disabled={loading} className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" /> : "Login to Dashboard"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;