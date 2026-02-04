import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
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

    
      dispatch(setCredentials({ user, token }));

      navigate("/"); 
    } catch (error: any) {
      console.error("Login Failed:", error);
      alert(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white rounded-[2rem] shadow-2xl overflow-hidden min-h-[600px]">
        
        {/* Left Side: Design Image */}
        <div className="w-full md:w-1/2 relative bg-slate-900">
          <img 
            src={teamERP} 
            alt="ERP System" 
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 flex flex-col justify-start p-10">
            <span className="text-white font-bold text-xl tracking-widest uppercase italic">ERP SYSTEM</span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-16 bg-white">
          <div className="max-w-sm mx-auto w-full">
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back!</h1>
              <p className="text-slate-500 text-sm">Sign in to your account</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} //
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} //
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-medium text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />
                  Remember Me
                </label>
                <a href="#" className="hover:text-blue-600">Forgot Password?</a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:bg-slate-300"
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;