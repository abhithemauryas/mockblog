const express=require("express")
const app=express()
const {connection}=require("./config/db")
const {userRoute}=require("./Router/user")
const {blogRoute}=require("./Router/blog")
const cors=require("cors")

require("dotenv").config()
app.use(express.json())
app.use(cors())


app.use(userRoute)
app.use(blogRoute)




app.listen(process.env.port,async()=>{
    try {
        await connection
        console.log("Db is connected")
    } catch (error) {
      console.log("Db is not connected")

    }
    console.log(`http://localhost:${process.env.port}`)
})

