const express = require('express');
const router = express.Router();
const bookController = require("../controllers/bookController")
const userController=require('../controllers/userController')

// -------- user creation and login api -------
router.post('/register',userController.createUser)
router.post("/login", userController.loginUser)


router.post("/books", bookController.createBook)
router.get("/books", bookController.getBooks)
router.get("/books/:bookId", bookController.getBooksById)
router.delete("/books/:bookId", bookController.deleteBooks)


module.exports = router