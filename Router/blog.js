const express=require("express")
const {authentication}=require("../middleware/authentication")
const blogRoute=express.Router()
const {PostModel}=require("../Models/blog.model")
const { userRoute } = require("./user")

blogRoute.use(authentication);

blogRoute.post("/api/blogs",async(req,res)=>{
    try {
        let {username,title,content,date,category,userId}=req.body
        console.log(req.body)
        date= new Date(date);
        let savePost=new PostModel({username,userId,title,category,content,date})
        await savePost.save()
        res.status(201).send({"msg":"Post has been created",savePost})
    } catch (error) {
        console.log(error)
        res.status(500).send({"msg":"something went wrong"})
    }
})



blogRoute.patch("/api/blogs/:id",async(req,res)=>{
    try {
        let id=req.params.id
        const userId=req.body.userId
        let data=req.body
        let find=await PostModel.findOne({_id:id,userId});
        console.log(data,userId,id,find)
        if(find){
            let savePost=await PostModel.findByIdAndUpdate({_id:id,userId},data,{new:true})
           return res.status(201).send({"msg":"Post has been updated",savePost})
        }else{
            return res.status(404).send({"msg":"Post has not found"})

        }
      
    } catch (error) {
        console.log(error)
        res.status(500).send({"msg":"something went wrong"}) 
    }
})

blogRoute.get("/api/blogs",async(req,res)=>{
    try {
        const {title,category,sort,order}=req.query;
        let query={}
        if(title){
            query["title"]=title
        }else  if(category){
            query["category"]=category
        }
        else if(sort){
            if(order=="asc"){
                let ans=await PostModel.find(query).sort({date:1}).populate({path:'userId',select:'username avatar'}).populate({path:'comments.username',select:'username avatar'}).exec()
                return res.status(200).send(ans)
            }else{
               let ans= await PostModel.find(query).sort({date:-1}).populate({path:'userId',select:'username avatar'}).populate({path:'comments.username',select:'username avatar'}).exec()
               return res.status(200).send(ans)
            }
        }

        let savePost =await PostModel.find(query).populate({path:'userId',select:'username avatar'}).populate({path:'comments.username',select:'username avatar'}).exec()
        return res.status(200).send(savePost)
    } catch (error) {
        console.log(error)
        res.status(500).send({"msg":"something went wrong"})  
    }
})

blogRoute.delete("/api/blogs/:id",async(req,res)=>{
    try {
        let id =req.params.id
        const {userId}=req.body
        console.log(id,userId)
        let savePost=await PostModel.findByIdAndDelete({_id:id,userId})
        res.status(201).send({"msg":"Post has been deleted"})
    } catch (error) {
        console.log(error)
        res.status(500).send({"msg":"something went wrong"})    
    }
})
blogRoute.put("/api/blogs/:id/like",async(req,res)=>{
    try {
        let {id}= req.params
        let {userId}=req.body;
        console.log("id",id,userId)
        let savePost=await PostModel.findById({_id:id})
        console.log(savePost)
        savePost.likes=savePost.likes+1
        let LikePost=await PostModel.findByIdAndUpdate({_id:id},savePost,{new:true})
        console.log(LikePost)
        res.status(201).send({"msg":"Post has been liked",LikePost})
    } catch (error) {
        console.log(error)
        res.status(500).send({"msg":"something went wrong"})  
    }
})
blogRoute.patch("/api/blogs/:id/comment",async(req,res)=>{
    try {
        let {id}=req.params
        let {userId,input}=req.body
        let  comments={
            content:input,
            username:userId,
        }
        console.log("object",req.body)
        console.log(comments,"comments")
    let savePost =await PostModel.findById({_id:id})
    savePost.comments.push(comments)
    // console.log(savePost)
    let LikePost=await PostModel.findByIdAndUpdate({_id:id},savePost,{new:true})
    // console.log(LikePost)
    return res.status(201).send({"msg":"Post has been Commented",LikePost})
    } catch (error) {
        console.log(error)
        res.status(500).send({"msg":"something went wrong"})    
    }
})


module.exports={
    blogRoute
}