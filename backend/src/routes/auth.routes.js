import {Router} from "express";
import {validateRegister, validateLogin} from "../validator/auth.validator.js";
import { register, login, googleCallback, getMe, logout, updateProfile } from "../controllers/auth.controller.js";
import { authenticateUser } from "../middlewares/auth.middlewares.js";
import passport from "passport";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});


const router = Router();

//@route POST /api/auth/register
//description: Register a new user
//access Public
//@route POST /api/auth/login
router.post('/register', validateRegister, register)

//@route POST /api/auth/login
//description: Login a user
//access Public
//@route GET /api/auth/google
router.post('/login', validateLogin, login)

//@route GET /api/auth/getMe
//description: Get user details
//access Private
//@route GET /api/auth/getMe
router.get('/getMe', authenticateUser, getMe)

//@route post/api/auth/logout
//description: post user logout
//accesss private
router.post('/logout', logout)

//@route GET /api/auth/google
//description: Google OAuth login
//access Public
//@route GET /api/auth/google
router.get('/google', (req, res, next) => {
    if (!passport._strategy('google')) {
        return res.status(503).json({ success: false, message: 'Google login is not configured' });
    }
    passport.authenticate('google', {scope: ['profile', 'email']})(req, res, next);
})


//@route GET /api/auth/google/callback
//description: Google OAuth callback
//access Public
//@route GET /api/auth/google/callback
router.get('/google/callback', (req, res, next) => {
    if (!passport._strategy('google')) {
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=google_not_configured`);
    }
    passport.authenticate('google', {
        session: false,
        failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=google_login_failed`,
    })(req, res, () => googleCallback(req, res, next));
})

// Update user profile
router.patch(
  "/profile",
  authenticateUser,
  upload.single("profilePicture"),
  updateProfile
);

export default router;
