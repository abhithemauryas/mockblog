const jwt= require("jsonwebtoken")
require("dotenv").config()

const authentication=(req,res,next)=>{
    let token=req.headers.authorization
    console.log(token)
    let decode=jwt.verify(token,process.env.secret)
    if(decode){
        req.body.userId=decode.userId
        next()
    }else{
        return res.status(404).send({"msg":"You have not login"})
    }
}

module.exports={
    authentication
}