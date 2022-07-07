const express = require('express');
const router = express.Router();
const bookController = require("../controllers/bookController")
const userController = require('../controllers/userController')
const auth = require("../middleware/auth")

// -------- user creation and login api -------
router.post('/register',userController.createUser)
router.post("/login", userController.loginUser)

// -------- Book creation, Updating and Deleting API-------
router.post("/books", auth.authenticate, bookController.createBook)
router.get("/books", auth.authenticate, bookController.getBooks)
router.get("/books/:bookId", auth.authenticate, bookController.getBooksById)
router.put("/books/:bookId", auth.authenticate, bookController.updateBookById)
router.delete("/books/:bookId", auth.authenticate, bookController.deleteBooks)


module.exports = router