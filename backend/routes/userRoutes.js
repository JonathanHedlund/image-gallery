const express = require('express')

const router = express.Router()
const { 
    registerUser,
    loginUser,
    getMyUser
} = require('../controllers/userController.js')

const { protect } = require('../middleware/authMiddleware')

router.route('/').post(registerUser).get(protect, getMyUser)
router.post('/login', loginUser)

module.exports = router