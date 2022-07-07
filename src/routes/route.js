const express = require('express');
const router = express.Router();
const bookController = require("../controllers/bookController")
const userController = require('../controllers/userController')


router.post('/register', userController.createUser)
router.post("/books", bookController.createBook)
router.get("/books", bookController.getBooks)
router.put("/books/:bookId", bookController.updateBookById)
router.delete("/books/:bookId", bookController.deleteBooks)
router.post("/login", userController.loginUser)

module.exports = router