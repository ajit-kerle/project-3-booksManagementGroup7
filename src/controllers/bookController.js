const mongoose = require("mongoose")
const userModel = require("../models/userModel")
const bookModel = require("../models/bookModel")
const reviewModel = require("../models/reviewModel")
const validator = require("../validators/validator")
const moment = require("moment")
const { restart } = require("nodemon")

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

//<<<<<<<<<<<<<<<<<<============================================GET BOOKS========================================>>>>>>>>>>>>>>>>>>>

const getBooks = async function (req, res) {
    try {
        const { userId, category, subcategory } = req.query
        const filterBook = { isDelated: false }
        if (userId || userId == "") {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).send({ status: false, message: "Invalid userId" })
            }
            filterBook["userId"] = userId
        }
        if (category) {
            filterBook["category"] = category
        }
        if (subcategory) {
            const subcategoryArr = subcategory.trim().split(',').map(subcategory => subcategory.trim())
            filterBook['subcategory'] = { $all: subcategoryArr }
        }
        let returnBooks = await bookModel.find(filterBook).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 }).sort({ title: 1 })
        if (Object.keys(returnBooks).length == 0) {
            return res.status(404).send({ status: false, message: " No book available show" })
        }
        else {
            res.status(200).send({ status: true, message: 'Books list', data: returnBooks })
        }
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}
//<<<<<<<<<<<============= Get Books Details By Book Id ===========>>>>>>>>>>>>

const getBooksById=async function(req,res){
    try{
        let bookId=req.params.bookId
        if(bookId){
            if(mongoose.Types.ObjectId.isValid(bookId)){
               const getBookData=await bookModel.findOne({_id:bookId,isDeleted:false},{deletedAt:0,ISBN:0,__v:0})
               if(getBookData){
                 let getReviewData=await reviewModel.find({bookId:getBookData._id},{isDeleted:0})
                 if(getReviewData){
                   const getBook={getBookData,getReviewData} 
                   res.status(200).send({ status: true, message: 'Books list', data:getBook })
                 }else{
                   const getBookvR={getBookData} 
                   res.status(200).send({ status: true, message: 'Books list', data:getBookvR })
                 }
                
               }else{
                return res.status(400).send({ status: false, message: "There no book available to show" })
               }
            }else{
                return res.status(400).send({ status: false, message: "Book Id is invalid " })
            }

        }else{
            return res.status(400).send({ status: false, message: "please provide Book id To get Book Details" })
        }

     
    }catch(err){
        res.status(500).send({ status: false, message: err.message })
    }
}

//<<<<<<<<<<<<<=================Delete books by bookId============>>>>>>>>>>>>>>>>>>>>

const deleteBooks = async function (req, res) {
    try {
        let bookId = req.params.bookId;
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).send({ status: false, message: "Incorrect BookId format" });
        }
        let book = await bookModel.findById(bookId)
        if (!book) {
            return res.status(404).send({ status: false, message: "book not found" })
        }
        if (book.isDeleted == true) {
            return res.status(400).send({ status: false, message: "Book doesn't exist" })
        }
        await bookModel.findByIdAndUpdate({ _id: bookId }, { $set: { isDeleted: true } }, { new: true })
        res.status(200).send({ status: true, message: "success" })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createBook, getBooks, deleteBooks,getBooksById }
