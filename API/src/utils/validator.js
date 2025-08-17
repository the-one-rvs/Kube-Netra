import { ApiError } from "./ApiError.js"

export const emailValidator = (email) => {
    if (!email.includes("@")) {
        throw new ApiError("Email Should have @ symbol")
    }
    if (!email.includes(".com")) {
        throw new ApiError("Email Should have .com")
    }
    return true
}

export const passValidator = (pass) => {
    if (pass.length < 8) {
        throw new ApiError(400, "Password should be at least 8 characters")
    }
    
    if (!pass.match(/[A-Z]/)) {
        throw new ApiError(400, "Password should have at least one capital letter")
    }
    
    if (!pass.match(/[^a-zA-Z0-9]/)) {
        throw new ApiError(400, "Password should have at least one special character")
    }
    
    if (!pass.match(/[0-9]/)) {
        throw new ApiError(400, "Password should have at least one numeric")
    }
    
    return true
}