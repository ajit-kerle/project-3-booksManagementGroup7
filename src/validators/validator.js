const isValid = (value) => {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false;
    if (typeof value === "string") { return true }
    else {
        return false
    }
}

const isValidArray = (value) => {
    if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
            if (value[i].trim().length === 0 || typeof (value[i]) !== "string") { return false }
        }
        return true
    } else { return false }
}

const isValidISBN = (value) => {
    const regEx = /^\s*\978([0-9]){10}\s*$/
    const result = regEx.test(value)
    return result
}

module.exports = { isValid, isValidArray, isValidISBN }