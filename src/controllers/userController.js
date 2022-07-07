const userModel=require('../models/userModel')
const { isValidObject, isValid, validTitle, validPassword } = require('../validators/validator')

// regex here
const nameRegex = /^[a-zA-Z\\s]{2,20}$/   
const mobileRegex = /^[6-9]\d{9}$/     
const emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,15}$/

const createUser=async function(req,res){
 try{
    let userData=req.body
    if(!isValidObject(userData)){
       res.status(400).send({status:false,message:"Provide all mandatory user information"}) 
    }else{
       let {title, name,phone,email,password,address}=userData 
       
       // validation for all fields
       let inValid=" "
       if(!validTitle(title)) inValid =inValid+"title, "
       if(!isValid(name) || !nameRegex.test(name)) inValid =inValid+"name,"
       if(!isValid(phone) || !mobileRegex.test(phone)) inValid =inValid+"phone,"
       if(!isValid(email) || !emailRegex.test(email)) inValid =inValid+"email, "
    
       if(!isValid(title)|| !isValid(name)|| !nameRegex.test(name) || !isValid(phone) || !mobileRegex.test(phone) || !isValid(email) || !emailRegex.test(email)){
        return res.status(400).send({status:false,message:`Pliz provide valid ${inValid} and it is mandatory fields`}) 
       }
       // psswd validation
       if(!passwordRegex.test(password)){
        return res.status(400).send({status:false,message:"password length 8 to 15 char, it must contain 1 upperCase, 1 lowerCase, 1 Number, 1 Special Character"}) 
       }

       //  checking email or phone number unique or not here 
       let uniqueEmail= await userModel.findOne({email:email})
       if(uniqueEmail){
        return res.status(400).send({status:false,message:"Email is already registered here provide unique email"}) 
       }
       let uniquePhone=await userModel.findOne({phone:phone})
       if(uniquePhone){
        return res.status(400).send({status:false,message:"Number is already registered here provide unique Number"}) 
       }

       if(address){
        if(isValidObject(address)){
       
          const {street,city,pincode}=address
            let empStr=""
            if(!isValid(street)) empStr+="street, "
            if(!isValid(city)) empStr+="city, "
            if(!isValid(pincode)) empStr+="pincode "

            if(!isValid(street) && !isValid(city) && !isValid(pincode)){
            return res.status(400).send({status:false,message:`Address must conatin ${empStr} and valid fields`}) 
            }
       }else{
        return res.status(400).send({status:false,message:"Address must be in object form street, city, pincode"}) 
       }
       }
       let savedUser=await userModel.create(userData)
       res.status(201).send({status:true,message:"Success",data:savedUser})
    } 
    }catch(err){
    res.status(500).send({status:false,message:err.message}) 
    }
}

module.exports.createUser=createUser