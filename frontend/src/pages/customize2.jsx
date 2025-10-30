import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/userData'
import axios from 'axios'
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import imagebg from '../assets/signupbgimg.png' 

function Customize2() {
  const { userData, backendImage, selectedImage, serverUrl, setUserData } = useContext(userDataContext)
  const [assistantName, setAssistantName] = useState(userData?.AssistantName || "")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleUpdateAssistant = async () => {
    setLoading(true)
    try {
      let formData = new FormData()
      formData.append("assistantName", assistantName)
      if (backendImage) {
        formData.append("assistantImage", backendImage)
      } else {
        formData.append("imageUrl", selectedImage)
      }

      const result = await axios.post(`${serverUrl}/api/user/update`, formData, { withCredentials: true })
      setLoading(false)
      setUserData(result.data)
      navigate("/")
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  return (
    <div
      className="w-full h-[100vh] bg-cover bg-center flex justify-center items-center flex-col p-[20px] relative"
      style={{
        backgroundImage: `url(${imagebg})`, 
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div> 

      <MdKeyboardBackspace
        className="absolute top-[30px] left-[30px] text-white cursor-pointer w-[25px] h-[25px] z-10 hover:text-blue-400 transition-all"
        onClick={() => navigate("/customize")}
      />

      <div className="z-10 flex flex-col items-center w-full max-w-[600px]">
        <h1 className="text-white mb-[40px] text-[28px] md:text-[32px] text-center font-semibold">
          Enter Your <span className="text-blue-300">Assistant Name</span>
        </h1>

        <input
          type="text"
          placeholder="e.g. Jarvis"
          className="w-full h-[60px] outline-none border-2 border-[#6a9eff] bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px] focus:border-white transition-all"
          required
          onChange={(e) => setAssistantName(e.target.value)}
          value={assistantName}
        />

        {assistantName && (
          <button
            className={`min-w-[250px] h-[55px] mt-[30px] font-semibold rounded-full text-[18px] transition-all ${
              loading
                ? "bg-gray-400 text-black cursor-not-allowed"
                : "bg-[#6a9eff] text-white hover:bg-white hover:text-[#030353]"
            }`}
            disabled={loading}
            onClick={handleUpdateAssistant}
          >
            {!loading ? "Finally Create Your Assistant" : "Loading..."}
          </button>
        )}
      </div>
    </div>
  )
}

export default Customize2
