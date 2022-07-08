const jwt = require("jsonwebtoken")

//================================================Authentication======================================================

const authenticate = function (req, res, next) {
    try {
        const token = req.headers["x-api-key"]
        if (!token) {
            res.status(400).send({ status: false, message: "token must be present" })
        }
        else {
            jwt.verify(token, "project/booksManagementGroup7", function (err, data) {
                if (err) {
                    return res.status(400).send({ status: false, message: err })
                }
                else {
                    req.loginUserId = data.userId
                    next()
                }
            })
        }
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports.authenticate = authenticate

