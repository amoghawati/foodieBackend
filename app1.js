const express=require("express");
const cors=require("cors");
const app=express();
const PORT =5000;

const mongoose=require("mongoose")
mongoose.set('strictQuery',false)
//require database model
const user=require('./Models/users')
const post=require("./Models/posts")
//middleware
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors())//cors origin resource share

const dburl="mongodb://localhost:27017/foodie";
mongoose.connect(dburl).then(()=>{
    console.log('connected to database');
})
app.post('/login',(req,res)=>{
    user.findOne({email:req.body.email},(err,userData)=>{
        if (userData) {
            if (req.body.password==userData.password) {
                res.send({message:"login successfull"})
            } else {
                res.send({message:"login failed (password not matching)"})
            }
        } else {
            res.send({message:"no account seems to be matching with your email address"})
        }
    })
})
app.post('/signup',async(req,res)=>{
    user.findOne({email:req.body.email},async (err,userData)=>{
        if(userData){
            res.send({message:"seems like you already have an account with this eamil"})
        }else{
            const data=  new user({
                name:req.body.name,
                email:req.body.email,
                phonenumber:req.body.phonenumber,
                password:req.body.password
            })
            // try{
            //     await data.save()
            //     res.send({message:"User registered successfully"})
            // }catch(err){
            //     res.send(err)
            // }
            data.save(()=>{
                if(err){
                    res.send(err)
                }else{
                    res.send({message:"user regustered successfully"})
                }
            })
        }
    })
    
})
app.get("/posts",async(req,res)=>{
    try{
        const Posts=await post.find()
        res.send(Posts)
        console.log(Posts);
    }catch(err){
        console.log(err);
    }
})
app.get("/posts/:id",async(req,res)=>{
    let {id}=req.params
    try{
        const singlePost=await post.findById(id);
        res.send(singlePost);
    }catch(err){
        res.send(err);
    }
})
app.post('/add-posts',async(req,res)=>{
    let postData=new post({
        author:req.body.author,
        title:req.body.title,
        summary:req.body.summary,
        image:req.body.image,
        location:req.body.location
    })
    try{
        await postData.save()
        await console.log(postData);
        res.send("post added successfully")
    }catch(err){
        console.log(err);
        res.send("failed to post")
    }
})
app.listen(PORT,()=>{
    console.log(`listening to port ${PORT}`);
})