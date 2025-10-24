import React, { useContext, useRef } from 'react'
import Card from '../components/Card'
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.jpg"
import image3 from "../assets/image3.png"
import image4 from "../assets/image4.png"
import image5 from "../assets/image5.png"
import image6 from "../assets/image6.jpeg"
import image7 from "../assets/image7.jpeg"
import imagebg from "../assets/signupbgimg.png"
import { RiImageAddLine } from "react-icons/ri";
import { MdKeyboardBackspace } from "react-icons/md";
import { userDataContext } from '../context/userData'
import { useNavigate } from 'react-router-dom'

function Customize() {
  const {
    serverUrl, userData, setUserData,
    backendImage, setBackendImage,
    frontendImage, setFrontendImage,
    selectedImage, setSelectedImage
  } = useContext(userDataContext)

  const navigate = useNavigate()
  const inputImage = useRef()

  const handleImage = (e) => {
    const file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center flex flex-col items-center justify-center px-4 sm:px-6 md:px-10 lg:px-20 relative overflow-y-auto"
      style={{ backgroundImage: `url(${imagebg})` }}
    >
      {/* Back Button */}
      <MdKeyboardBackspace
        className="absolute top-6 left-6 text-[#b3b3ff] cursor-pointer w-[25px] h-[25px] hover:scale-110 transition-transform duration-200"
        onClick={() => navigate("/")}
      />

      {/* Title */}
      <h1 className="text-[#b3b3ff] mb-10 text-2xl sm:text-3xl md:text-4xl text-center font-semibold drop-shadow-lg">
        Select your <span className="text-blue-300">Assistant Image</span>
      </h1>

      {/* Card Grid */}
      <div className="w-full max-w-[950px] flex justify-center items-center flex-wrap gap-4 sm:gap-6 md:gap-8 mb-10">
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} />

        {/* Upload Card */}
        <div
          className={`w-[90px] h-[150px] sm:w-[130px] sm:h-[200px] lg:w-[160px] lg:h-[240px] bg-[#020220cc] border-2 rounded-2xl overflow-hidden cursor-pointer flex items-center justify-center transition-all duration-200 hover:shadow-lg hover:shadow-blue-800 hover:scale-105 ${selectedImage === "input"
            ? "border-4 border-blue-400 shadow-2xl shadow-blue-900"
            : "border-[#0000ff66]"}`}
          onClick={() => {
            inputImage.current.click()
            setSelectedImage("input")
          }}
        >
          {!frontendImage && (
            <RiImageAddLine className="text-[#b3b3ff] w-[25px] h-[25px]" />
          )}
          {frontendImage && (
            <img src={frontendImage} className="h-full w-full object-cover" />
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          ref={inputImage}
          hidden
          onChange={handleImage}
        />
      </div>

      {selectedImage && (
       <button
       disabled={!selectedImage}
       className={`min-w-[140px] sm:min-w-[160px] md:min-w-[180px] h-[45px] sm:h-[55px] mb-10 font-semibold rounded-full text-lg sm:text-xl shadow-md transition-all duration-300
         ${selectedImage
           ? 'bg-blue-500 text-white hover:bg-blue-600'
           : 'bg-gray-400 text-gray-700 cursor-not-allowed'}
       `}
       onClick={() => navigate("/customize2")}
     >
       Next
     </button>
     
      )}
    </div>
  )
}

export default Customize
