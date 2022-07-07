const mongoose = require("mongoose")
const userModel = require("../models/userModel")
const bookModel = require("../models/bookModel")
const validator = require("../validators/validator")
const moment = require("moment")

const createBook = async function (req, res) {
    try {
        const { title, excerpt, userId, ISBN, category, subcategory } = req.body
        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "Please enter the data to create book" })
        }
        if ((title && excerpt && userId && ISBN && category && subcategory)) {
            if (!validator.isValid(title)) {
                return res.status(400).send({ status: false, message: "Please enter valid title in String" })
            }
            const findTitle = await bookModel.findOne({ title: title.trim().toUpperCase() })
            if (findTitle) {
                return res.status(409).send({ status: false, message: `title ${title.trim()} is already present` })
            }
            if (!validator.isValid(excerpt)) {
                return res.status(400).send({ status: false, message: "Please enter valid excerpt in String" })
            }
            if (!mongoose.Types.ObjectId.isValid(userId.trim())) {
                return res.status(400).send({ status: false, message: "Please enter valid userId" })
            }
            const findUser = await userModel.findById(userId.trim())
            if (!findUser) {
                return res.status(404).send({ status: false, message: "User not found" })
            }
            if (!validator.isValidISBN(ISBN) && !validator.isValid(ISBN)) {
                return res.status(400).send({ status: false, message: "Please enter valid ISBN Number and it should be in String, size should be of 13 e.g: '9781234567890'" })
            }
            const findISBN = await bookModel.findOne({ ISBN: ISBN.trim() })
            if (findISBN) {
                return res.status(409).send({ status: false, message: `ISBN number ${ISBN.trim()} is already present` })
            }
            if (!validator.isValid(category)) {
                return res.status(400).send({ status: false, message: "Please enter valid category in String" })
            }
            if (!validator.isValidArray(subcategory)) {
                return res.status(400).send({ status: false, message: "Please enter valid subcategory in array (string) e.g:['subcategory1']" })
            }
            const bookData = {
                title: title.trim().toUpperCase(),
                excerpt: excerpt.trim(),
                userId: userId.trim(),
                ISBN: ISBN.trim(),
                category: category.trim(),
                subcategory: subcategory,
                releasedAt: moment().format("YYYY-MM-DD")
            }
            const createBook = await bookModel.create(bookData)
            return res.status(201).send({ status: true, message: 'Success', data: createBook })
        }
        else {
            return res.status(400).send({ status: false, message: "Please enter title, excerpt, userId, ISBN, category and subcategory to create book" })
        }
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.createBook = createBook