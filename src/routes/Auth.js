const router = require('express').Router();
const authController = require('../controllers/AthuController');

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/refreshToken", authController.requestRefreshToken);
router.get("/logout", authController.userLogout);

module.exports = router;