const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")
const bookModel = require("../models/bookModel")
const mongoose = require("mongoose")

//================================================Authentication======================================================

const authenticate = function (req, res, next) {
    try {
        const token = req.headers["x-api-key"]
        if (!token) {
            res.status(400).send({ status: false, message: "token must be present" })
        }
        else {
            try {
                const decodeToken = jwt.verify(token, "project/booksManagementGroup7")
                if (decodeToken.exp < Date.now()) {
                    next()
                }
                else {
                    res.status(400).send({ status: false, message: "Token has expired" })
                }
            }
            catch (error) {
                res.status(400).send({ status: false, message: "Invalid token" })
            }
        }
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

//================================================Authorisation======================================================

const authorise = async function (req, res, next) {
    try {
        const bookId = req.params.bookId
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).send("provide valid bookId")
        }
        const bookData = await bookModel.findById(bookId).select({ userId: 1, _id: 0 })
        if (!bookData) {
            return res.status(404).send("book not found")
        }
        const token = req.headers["x-api-key"]
        const decodedToken = jwt.verify(token, "project/booksManagementGroup7")
        if (bookData.userId == decodedToken.userId) {
            next()
        }
        else {
            res.status(401).send("unauthorized user")
        }
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.authenticate = authenticate
module.exports.authorise = authorise