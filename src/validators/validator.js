function isValidObject(value) {
    return (Object.keys(value).length > 0)
}

const isValid = (value) => {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false;
    if (typeof value === "string") { return true }
    else {
        return false
    }
}

function validTitle(value) {
    if (typeof value === "undefined" || typeof value === "null" || typeof value === "number") return false
    if (typeof value === "string" && value.trim().length === 0) return false
    if (value) value = value.trim()
    if (value !== "Mr" && value !== "Miss" && value !== "Mrs") return false
    return true
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

const isValidDate = (value) => {
    const regEx = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/
    const result = regEx.test(value)
    return result
}
module.exports = { isValid, isValidArray, isValidISBN, isValidObject, validTitle, isValidDate }
