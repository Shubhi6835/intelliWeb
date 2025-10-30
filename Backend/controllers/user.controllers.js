import uploadOnCloudinary from "../config/cloudinary.js"
import geminiResponse from "../gemini.js"
import User from "../models/user.model.js"
import moment from "moment-timezone"

//  Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId
    const user = await User.findById(userId).select("-password")
    if (!user) {
      return res.status(400).json({ message: "user not found" })
    }

    return res.status(200).json(user)
  } catch (error) {
    return res.status(400).json({ message: "get current user error" })
  }
}

//  Update Assistant details
export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body
    let assistantImage

    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path)
    } else {
      assistantImage = imageUrl
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        assistantName,
        assistantImage,
      },
      { new: true }
    ).select("-password")

    return res.status(200).json(user)
  } catch (error) {
    return res.status(400).json({ message: "updateAssistantError user error" })
  }
}

//  Ask to Assistant
export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body
    const user = await User.findById(req.userId)
    user.history.push(command)
    await user.save()

    const userName = user.name
    const assistantName = user.assistantName
    const result = await geminiResponse(command, assistantName, userName)

    const jsonMatch = result.match(/{[\s\S]*}/)
    if (!jsonMatch) {
      return res.status(400).json({ response: "Sorry, I can't understand that." })
    }

    const gemResult = JSON.parse(jsonMatch[0])
    const type = gemResult.type

    //  Timezone detection based on country/city in command
    let timeZone = "Asia/Kolkata" // default timezone (India)
    const lowerCmd = command.toLowerCase()

    if (lowerCmd.includes("new york")) timeZone = "America/New_York"
    else if (lowerCmd.includes("london")) timeZone = "Europe/London"
    else if (lowerCmd.includes("tokyo")) timeZone = "Asia/Tokyo"
    else if (lowerCmd.includes("dubai")) timeZone = "Asia/Dubai"
    else if (lowerCmd.includes("paris")) timeZone = "Europe/Paris"
    else if (lowerCmd.includes("sydney")) timeZone = "Australia/Sydney"
    else if (lowerCmd.includes("los angeles")) timeZone = "America/Los_Angeles"
    else if (lowerCmd.includes("singapore")) timeZone = "Asia/Singapore"
    else if (lowerCmd.includes("berlin")) timeZone = "Europe/Berlin"

    //  Type-based response handling
    switch (type) {
      case "get-date":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current date in ${timeZone.split("/")[1].replace("_", " ")} is ${moment()
            .tz(timeZone)
            .format("YYYY-MM-DD")}`,
        })

      case "get-time":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current time in ${timeZone.split("/")[1].replace("_", " ")} is ${moment()
            .tz(timeZone)
            .format("hh:mm A")}`,
        })

      case "get-day":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Today in ${timeZone.split("/")[1].replace("_", " ")} is ${moment()
            .tz(timeZone)
            .format("dddd")}`,
        })

      case "get-month":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current month in ${timeZone.split("/")[1].replace("_", " ")} is ${moment()
            .tz(timeZone)
            .format("MMMM")}`,
        })

      //  Web-related commands
      case "google-search":
      case "youtube-search":
      case "youtube-play":
      case "general":
      case "calculator-open":
      case "instagram-open":
      case "facebook-open":
      case "weather-show":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response,
        })

      default:
        return res.status(400).json({ response: "I didn't understand that command." })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ response: "ask assistant error" })
  }
}
