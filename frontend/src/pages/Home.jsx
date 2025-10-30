import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/userData'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import aiImg from "../assets/ai.gif"
import { CgMenuRight } from "react-icons/cg"
import { RxCross1 } from "react-icons/rx"
import userImg from "../assets/user.gif"

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext)
  const navigate = useNavigate()
  const [listening, setListening] = useState(false)
  const [userText, setUserText] = useState("")
  const [aiText, setAiText] = useState("")
  const [ham, setHam] = useState(false)
  const menuRef = useRef(null)
  const recognitionRef = useRef(null)
  const isSpeakingRef = useRef(false)
  const isRecognizingRef = useRef(false)
  const synth = window.speechSynthesis

  // Logout
  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
      setUserData(null)
      navigate("/signin")
    } catch (error) {
      console.log(error)
      setUserData(null)
    }
  }

  // Start speech recognition safely
  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start()
      } catch (error) {
        if (error.name !== "InvalidStateError") console.error("Start error:", error)
      }
    }
  }

  // Speak AI response
  const speak = (text) => {
    const utterence = new SpeechSynthesisUtterance(text)
    utterence.lang = 'hi-IN'
    const voices = window.speechSynthesis.getVoices()
    const hindiVoice = voices.find(v => v.lang === 'hi-IN')
    if (hindiVoice) utterence.voice = hindiVoice

    isSpeakingRef.current = true
    utterence.onend = () => {
      setAiText("")
      isSpeakingRef.current = false
      setTimeout(() => startRecognition(), 800) // delay to avoid race condition
    }
    synth.cancel() // Cancel any ongoing speech
    synth.speak(utterence)
  }

  // Handle voice commands
  const handleCommand = (data) => {
    const { type, userInput, response } = data
    speak(response)

    if (type === 'google-search')
      window.open(`https://www.google.com/search?q=${encodeURIComponent(userInput)}`, '_blank')

    if (type === 'calculator-open')
      window.open(`https://www.google.com/search?q=calculator`, '_blank')

    if (type === 'instagram-open')
      window.open(`https://www.instagram.com/`, '_blank')

    if (type === 'facebook-open')
      window.open(`https://www.facebook.com/`, '_blank')

    if (type === 'weather-show')
      window.open(`https://www.google.com/search?q=weather`, '_blank')

    if (type === 'youtube-search' || type === 'youtube-play')
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`, '_blank')
  }

  //  Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognitionRef.current = recognition

    let isMounted = true  // flag to avoid state updates on unmounted component

    //start recognition after 1 sec
    const startTimeout = setTimeout(() => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start()
        } catch (e) {
          if (e.name !== "InvalidStateError") console.error(e)
        }
      }
    }, 1000)

    recognition.onstart = () => {
      isRecognizingRef.current = true
      setListening(true)
    }

    recognition.onend = () => {
      isRecognizingRef.current = false
      setListening(false)
      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          try {
            recognition.start()
          } catch (e) {
            if (e.name !== "InvalidStateError") console.error(e)
          }
        }, 1000)
      }
    }

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error)
      isRecognizingRef.current = false
      setListening(false)
      if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          try {
            recognition.start()
          } catch (e) {
            if (e.name !== "InvalidStateError") console.error(e)
          }
        }, 1000)
      }
    }

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim()
      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        setAiText("")
        setUserText(transcript)
        recognition.stop()
        isRecognizingRef.current = false
        setListening(false)
        const data = await getGeminiResponse(transcript)
        handleCommand(data)
        setAiText(data.response)
        setUserText("")
      }
    }

    //  Greet user
    const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you with?`)
    greeting.lang = 'hi-IN'
    window.speechSynthesis.speak(greeting)

    return () => {
      isMounted = false
      clearTimeout(startTimeout)
      recognition.stop()
      setListening(false)
      isRecognizingRef.current = false
    }
  }, [])

  //  Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setHam(false)
      }
    }
    if (ham) document.addEventListener('mousedown', handleClickOutside)
    else document.removeEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [ham])

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-black to-[#02023d] flex justify-center items-center flex-col gap-[15px] overflow-hidden'>

      {/*  Hamburger Icon (only when closed) */}
      {!ham && (
        <CgMenuRight
          className='text-white absolute top-[20px] right-[20px] w-[30px] h-[30px] cursor-pointer z-50'
          onClick={() => setHam(true)}
        />
      )}

      {/*  Hamburger Menu */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 w-[80%] sm:w-[300px] h-full bg-[#0a0a2aef] shadow-xl transform ${ham ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out flex flex-col items-center justify-center gap-8 z-40`}
      >
        {/*  Close Button (only visible when open) */}
        {ham && (
          <RxCross1
            className='text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer z-50'
            onClick={() => setHam(false)}
          />
        )}

        <button
          className='w-[200px] h-[55px] bg-white text-black font-semibold rounded-full cursor-pointer text-[18px] hover:scale-105 transition-transform duration-200'
          onClick={() => {
            navigate("/customize")
            setHam(false)
          }}
        >
          Customize Assistant
        </button>

        <button
          className='w-[200px] h-[55px] bg-white text-black font-semibold rounded-full cursor-pointer text-[18px] hover:scale-105 transition-transform duration-200'
          onClick={handleLogOut}
        >
          Log Out
        </button>
      </div>

      {/*  Assistant Display */}
      <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'>
        <img src={userData?.assistantImage} alt="" className='h-full object-cover' />
      </div>

      <h1 className='text-white text-[18px] font-semibold'>I'm {userData?.assistantName}</h1>

      {!aiText && <img src={userImg} alt="" className='w-[200px]' />}
      {aiText && <img src={aiImg} alt="" className='w-[200px]' />}

      <h1 className='text-white text-[18px] font-semibold text-wrap text-center px-4'>
        {userText ? userText : aiText ? aiText : null}
      </h1>
    </div>
  )
}

export default Home
