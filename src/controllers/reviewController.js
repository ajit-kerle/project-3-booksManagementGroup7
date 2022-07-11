const mongoose = require("mongoose")
const bookModel = require("../models/bookModel")
const reviewModel = require("../models/reviewModel")
const validator = require("../validators/validator")

//<<<<<<<<<<<<<<<<<<============================================CREATE REVIEW========================================>>>>>>>>>>>>>>>>>>>

const createReview = async function (req, res) {
    try {
        const bookId = req.params.bookId
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).send({ status: false, message: "provide valid bookId in params" })
        }
        const bookData = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!bookData) {
            return res.status(404).send({ status: false, message: "Book not found" })
        }
        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "Please Enter valid data in body to create review" });
        }
        const { review, rating, reviewedBy } = req.body
        const filterReview = { bookId, rating, reviewedAt: new Date() }
        if (rating) {
            if (!validator.isValidRating(rating)) {
                return res.status(400).send({ status: false, message: "Please Enter valid rating between 1 to 5" });
            }
            if (review) {
                if (!validator.isValid(review)) {
                    return res.status(400).send({ status: false, message: "Please Enter valid review" });
                }
                filterReview["review"] = review
            }
            if (reviewedBy) {
                if (!validator.isValid(reviewedBy)) {
                    return res.status(400).send({ status: false, message: "Please Enter valid reviewer name" });
                }
                filterReview["reviewedBy"] = reviewedBy
            }
            const createReview = await reviewModel.create(filterReview)
            await bookModel.findByIdAndUpdate({ _id: bookId }, { reviews: bookData.reviews + 1 })
            return res.status(201).send({ status: true, message: "Success", data: createReview })
        }
        else {
            return res.status(400).send({ status: false, message: "Please Enter rating" });
        }
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createReview }