import {body, validationResult} from "express-validator";

function validateRequest(req, res, next){
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    next()
}

//validate create product
export const createProductValidator = [
    body("title")
        .notEmpty().withMessage("Title is required")
        .isLength({ min: 3 }).withMessage("Title must be at least 3 characters long"),

    body("description")
        .notEmpty().withMessage("Description is required")
        .isLength({ min: 10 }).withMessage("Description must be at least 10 characters long"),

    body("price")
        .custom((value) => {
            let parsed;
            try {
                parsed = typeof value === "string" ? JSON.parse(value) : value;
            } catch (error) {
                return false;
            }
            return parsed && Number(parsed.amount) > 0 && ["USD", "EUR", "GBP", "JPY", "INR"].includes(parsed.currency || "INR");
        }).withMessage("A valid positive price and currency are required"),

    body("stock")
        .optional()
        .isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),

    validateRequest
]
