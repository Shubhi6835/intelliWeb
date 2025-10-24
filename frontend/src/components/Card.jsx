import React, { useContext } from 'react'
import { userDataContext } from '../context/userData'

function Card({ image }) {
  const {
    serverUrl, userData, setUserData,
    backendImage, setBackendImage,
    frontendImage, setFrontendImage,
    selectedImage, setSelectedImage
  } = useContext(userDataContext)

  const isSelected = selectedImage === image

  return (
    <div
      className={`
        w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] 
        bg-[#020220cc] 
        border-2 border-[#0000ff66] 
        rounded-2xl overflow-hidden 
        cursor-pointer 
        transition-all duration-300 
        hover:shadow-2xl hover:shadow-blue-800 hover:border-[#00f] 
        ${isSelected ? "border-4 border-[#00f] shadow-2xl shadow-blue-900" : ""}
      `}
      onClick={() => {
        setSelectedImage(image)
        setBackendImage(null)
        setFrontendImage(null)
      }}
    >
      <img src={image} className="h-full w-full object-cover" />
    </div>
  )
}

export default Card
