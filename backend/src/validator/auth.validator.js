import {body, validationResult} from "express-validator";

function validateRequest(req, res, next){
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    next()
}

//validate register 
export const validateRegister =[
    body("email")
        .isEmail().withMessage("Invalid email format"),

    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
        
    body("fullName") 
         .notEmpty().withMessage("Full name is required")
         .isLength({ min: 3 }).withMessage("Full name must be at least 3 characters long"),

    // body("isSeller")
    //     .isBoolean().withMessage("isSeller must be a boolean value")
    //     .toBoolean(),

    validateRequest
]

//validate login
export const validateLogin = [
    body("email")
        .isEmail().withMessage("Invalid email format"), 

    body("password")
        .notEmpty().withMessage("Password is required"),
        
    validateRequest
]