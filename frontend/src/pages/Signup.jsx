import React, { useContext, useState } from 'react'
import bgimg from "../assets/signupbgimg.png"
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/userData';
import axios from "axios"

function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const { serverUrl,userData,setUserData } = useContext(userDataContext)
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [err, setErr] = useState("")

  const handleSignUp = async (e) => {
    e.preventDefault()
    setErr("")
    setLoading(true)
    try {
        const result=await axios.post(`${serverUrl}/api/auth/signup`, {
        name, email, password
      }, { withCredentials: true })
      setUserData(result.data)
      setLoading(false)
      navigate("/customize")
    } catch (error) {
      console.log(error)
      setUserData(null)
      setLoading(false)
      setErr(error.response?.data?.message || "Something went wrong")
    }
  }

  return (
    <div
      className="w-full h-screen bg-cover bg-center flex justify-center items-center px-4"
      style={{ backgroundImage: `url(${bgimg})` }}
    >
      <form
        className="w-full max-w-md bg-[#00000062] backdrop-blur rounded-2xl 
                   shadow-2xl border border-white/30 
                   flex flex-col items-center gap-6 p-8 sm:p-10"
        onSubmit={handleSignUp}
      >
        <h1 className="text-white text-3xl sm:text-4xl font-bold text-center">
          Register to <span className="text-rose-400">IntelliWeb</span>
        </h1>

        <input
          type="text"
          placeholder="Enter your Name"
          className="w-full h-14 px-5 text-white placeholder-gray-300 
                     bg-transparent border border-white/40 rounded-xl 
                     focus:outline-none focus:ring-2 focus:ring-rose-400 
                     transition-all duration-300"
          required
          onChange={(e) => setName(e.target.value)}
          value={name}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full h-14 px-5 text-white placeholder-gray-300 
                     bg-transparent border border-white/40 rounded-xl 
                     focus:outline-none focus:ring-2 focus:ring-rose-400 
                     transition-all duration-300"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <div className="w-full h-14 relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full h-full px-5 pr-12 text-white placeholder-gray-300 
                       bg-transparent border border-white/40 rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-rose-400 
                       transition-all duration-300"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {!showPassword ? (
            <IoEye
              className="absolute top-1/2 right-4 -translate-y-1/2 text-white w-6 h-6 cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          ) : (
            <IoEyeOff
              className="absolute top-1/2 right-4 -translate-y-1/2 text-white w-6 h-6 cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          )}
        </div>

        {err && (
          <p className="text-red-400 text-sm text-center">*{err}</p>
        )}

        <button
          className="w-full h-14 mt-2 text-lg font-semibold rounded-xl 
                     bg-gradient-to-r from-rose-400 to-rose-500 text-white 
                     hover:opacity-90 hover:shadow-lg hover:shadow-rose-500/40
                     disabled:opacity-50 transition-all duration-300"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>

        <p
          className="text-white text-sm sm:text-base mt-4 cursor-pointer hover:underline"
          onClick={() => navigate("/login")}
        >
          Already have an account?{" "}
          <span className="text-rose-400 font-medium">Log In</span>
        </p>
      </form>
    </div>
  )
}

export default SignUp
