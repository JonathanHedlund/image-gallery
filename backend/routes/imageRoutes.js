const express = require('express')

const router = express.Router()
const { 
     getImages,
     getImagesLoggedIn,
     getMyBookmarks,
     bookmarkImage,
     removeBookmark
} = require('../controllers/imageController.js')

const { protect } = require('../middleware/authMiddleware')

router.get('/', getImages)
router.get('/logged-in', protect, getImagesLoggedIn)
router.get('/bookmarks', protect, getMyBookmarks)
router.put('/bookmark', protect, bookmarkImage)
router.put('/remove-bookmark', protect, removeBookmark)

module.exports = router