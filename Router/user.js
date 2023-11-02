const express=require("express")

const userRoute=express.Router()
const {userModel}=require("../Models/user.model")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
require("dotenv").config()


userRoute.post("/api/register",async(req,res)=>{
    let {username,avatar,email,password}=req.body
    try {
        console.log(req.body)
      let user =await userModel.findOne({email})
      if(user){
          return res.status(409).send({"Success": false,"error":"already exists please login"})
      }
      const hash= bcrypt.hashSync(password,6)
      let newUser= new userModel({username,avatar,email,password:hash})
      console.log(newUser)
      await newUser.save()
      res.status(200).send({"msg":"User registraction successfully"})
    } catch (error) {
      res.status(400).send({"error": error.message})
      
    }
  })





userRoute.post("/api/login",async(req,res)=>{
    try {
        let {email,password}=req.body
        let checkEmail=await userModel.findOne({email})
        console.log(checkEmail)
        if(checkEmail){
            bcrypt.compare(password,checkEmail.password,async(err,result)=>{
                if(err){
                    res.status(501).send({"msg":"error in comparing password"})
                }else{
                    let token=jwt.sign({userId:checkEmail._id},process.env.Secret)
                    res.status(201).send({"msg":"login successfully", token,user:checkEmail})
                }
            })
        }
        else{
            res.status(402).send({"msg":"go for signup first"})
        }
    } catch (error) {
        console.log("err",error)
        res.status(500).send({"msg":error})
    }
})

module.exports={
    userRoute
}