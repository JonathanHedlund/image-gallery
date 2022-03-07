const asyncHandler = require('express-async-handler')
const axios = require('axios');

const User = require('../models/userModel')

// @desc test if it is actually up
// @route GET /api/images
// @access Public
const getImages = asyncHandler(async (req, res) => {
    const imagesToFind = []
    const urlsToReturn = []

    await axios.get(`${process.env.FLICKR_API_URL}?method=flickr.photos.search&api_key=${process.env.FLICKR_KEY}&page=${parseInt(req.query.page)}&per_page=12&tags=${req.query.tags}&format=json&nojsoncallback=1`)
    .then(function (response) {
        // handle success
        imagesToFind.push(...response.data.photos.photo)
    })
    .catch(function (error) {
        const message =
        (error.response &&
            error.response.data &&
            error.response.data.message) ||
        error.message ||
        error.toString()

        res.status(400)
        throw new Error(message)
    })

    for (var image of imagesToFind) {
        if (image.server && image.id && image.secret) {
            await axios.get(`https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}.jpg`)
            .then(function (response) {
                urlsToReturn.push(response.config.url)
            })
            .catch(function (error) {
                const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString()

                res.status(400)
                throw new Error(message)
            })
        }
    }

    res.status(200).json(urlsToReturn)
})

// @desc Get images call for logged in users
// @route GET /api/images/logged-in
// @access Private
const getImagesLoggedIn = asyncHandler(async (req, res) => {
    const imagesToFind = []
    const urlsToCheck = []
    const urlsToReturn = []
    
    // Check for user
    if (!req.user) {
        res.status(401)
        throw new Error('User not found')
    }

    await axios.get(`${process.env.FLICKR_API_URL}?method=flickr.photos.search&api_key=${process.env.FLICKR_KEY}&page=${parseInt(req.query.page)}&per_page=12&tags=${req.query.tags}&format=json&nojsoncallback=1`)
    .then(function (response) {
        // handle success
        imagesToFind.push(...response.data.photos.photo)
    })
    .catch(function (error) {
        const message =
        (error.response &&
            error.response.data &&
            error.response.data.message) ||
        error.message ||
        error.toString()

        res.status(400)
        throw new Error(message)
    })

    for (var image of imagesToFind) {
        if (image.server && image.id && image.secret) {
            await axios.get(`https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}.jpg`)
            .then(function (response) {
                urlsToCheck.push(response.config.url)
            })
            .catch(function (error) {
                const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString()

                res.status(400)
                throw new Error(message)
            })
        }
    }

    // Check if images are bookmarked
    if (req.user.bookmarkedImages) {
        for (var image of urlsToCheck) {
            var alreadyBookmarked = false

            for (var bookmarkedImage of req.user.bookmarkedImages) {
                if (bookmarkedImage.imageURL == image) {
                    alreadyBookmarked = true
                }
            }
            urlsToReturn.push({
                imageURL: image,
                bookmarked: alreadyBookmarked
            })
        }
    }

    res.status(200).json(urlsToReturn)
})

// @desc Get users bookmarked images
// @route GET /api/bookmarks
// @access Public
const getMyBookmarks = asyncHandler(async (req, res) => {
    // Check for user
    if (!req.user) {
        res.status(401)
        throw new Error('User not found')
    }

    res.status(200).json(req.user.bookmarkedImages)
})

// @desc Bookmarks image
// @route PUT /api/bookmark
// @access Private
const bookmarkImage = asyncHandler(async (req, res) => {
    const additional = {}

    // Check for user
    if (!req.user) {
        res.status(401)
        throw new Error('User not found')
    }

    const url = req.body.url

    for (var image of req.user.bookmarkedImages) {
        if (image.imageURL.toString() == url.toString()) {
            additional.exists = true
        }
    }

    if (!additional.exists) {
        const updatedBookmarks = await User.findByIdAndUpdate(req.user._id,
            {
                $push: {"bookmarkedImages": {imageURL: url}}
            },
            {   
                "fields": { "bookmarkedImages":1 },
                new: true
    
            },)
    
        res.status(200).json(updatedBookmarks.bookmarkedImages)
    } else {
        res.json("Image already exists")
    }
})

// @desc Bookmarks image
// @route PUT /api/bookmark
// @access Private
const removeBookmark = asyncHandler(async (req, res) => {
    const additional = {}

    // Check for user
    if (!req.user) {
        res.status(401)
        throw new Error('User not found')
    }

    const url = req.body.url

    const updatedBookmarks = await User.findByIdAndUpdate(req.user._id,
        {
            $pull: {"bookmarkedImages": {imageURL: url}}
        },
        {   
            "fields": { "bookmarkedImages":1 },
            new: true

        },)

    res.status(200).json(updatedBookmarks.bookmarkedImages)
})

module.exports = {
    getImages,
    getMyBookmarks,
    bookmarkImage,
    removeBookmark,
    getImagesLoggedIn
}