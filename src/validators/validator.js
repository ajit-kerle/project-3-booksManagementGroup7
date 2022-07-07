function isValidObject(value){
    return (Object.keys(value).length>0)
}

function isValid(value){
   if(typeof value === "undefined" || typeof value==="null"  ) return false
   if(typeof value==="string" && value.trim().length===0) return false
   return true
}


function validTitle(value){
   if(typeof value === "undefined" || typeof value==="null" || typeof value==="number" ) return false
   if(typeof value==="string" && value.trim().length===0) return false
   if(value) value=value.trim()
   if(value !== "Mr" && value !=="Miss" && value !=="Mrs") return false
   return true
}


module.exports.isValidObject=isValidObject
module.exports.isValid=isValid
module.exports.validTitle=validTitle
// module.exports.validPassword=validPassword