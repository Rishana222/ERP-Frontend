import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { setCredentials } from "../store/authSlice";
import { loginService } from "../Utils/LoginAPI";
import teamERP from "../assets/group.jpg";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

      localStorage.setItem(
        "userInfo",
        JSON.stringify({ user, token })
      );

      dispatch(setCredentials({ user, token }));
      navigate("/");
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 px-4 py-6">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">

        {/* LEFT IMAGE SECTION */}
        <div className="relative w-full lg:w-1/2 h-48 sm:h-64 md:h-80 lg:h-auto">
          <img
            src={teamERP}
            alt="ERP"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex items-end p-6 sm:p-8 lg:p-12">
            <span className="text-white text-lg sm:text-xl lg:text-2xl font-bold tracking-widest uppercase">
              ERP SYSTEM
            </span>
          </div>
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-16">
          <form
            onSubmit={handleLogin}
            className="w-full max-w-md space-y-5 sm:space-y-6"
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800">
              Welcome Back
            </h1>

            {/* EMAIL */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                required
                className="w-full pl-12 pr-4 py-3 sm:py-4 bg-slate-50 border rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full pl-12 pr-12 py-3 sm:py-4 bg-slate-50 border rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md flex items-center justify-center gap-2 transition disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Logging in...
                </>
              ) : (
                "Login "
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;