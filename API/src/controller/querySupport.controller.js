import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { sendContactMail } from "../utils/queryMailer.js"

const querySupport = asyncHandler(async (req, res) => {
    try {
        const {email, msg} = req.body
        try {
           const sendMail = await sendContactMail({email: "vaibhavsarswat142005@gmail.com", msg: msg, mailId: email})
           if (!sendMail){
               throw new ApiError(400, "Failed to send mail")
           } 
        } catch (error) {
            throw new ApiError(400, error?.message)
        }
        return res.status(200).json(new ApiResponse(200, {}, "Message sent successfully"))
    } catch (error) {
        throw new ApiError(400, error?.message)
    }
})

export {querySupport}