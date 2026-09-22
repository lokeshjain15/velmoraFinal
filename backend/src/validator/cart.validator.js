import {body, param, validationResult} from "express-validator";

function validateRequest(req, res, next){
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    next()
}    

export const validateAddToCart = [
    param("productId").isMongoId().withMessage("Invalid product ID"),
    body("quantity").optional().isInt({ min: 1 }).withMessage("Invalid quantity"),
    validateRequest
];

export const validateIncrementCartItemQuantity = [
    param("productId").isMongoId().withMessage("Invalid product ID"),
    validateRequest
];

export const validateDecrementCartItemQuantity = [
    param("productId").isMongoId().withMessage("Invalid product ID"),
    validateRequest
];

export const validateRemoveCartItem = [
    param("productId").isMongoId().withMessage("Invalid product ID"),
    validateRequest
];