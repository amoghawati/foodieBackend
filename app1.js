const express=require('express')
const cors=require("cors")
const app=express()
const PORT =5000

const mongoose=require("mongoose")
mongoose.set('strictQuery',false)
//require database model
const user=require('./Models/users')
//middleware
app.use(express.json)
app.use(express.urlencoded({extended:false}))
app.use(cors())//cors origin resource share

constdburl='mongodb://localhost:/27017/foodie'
mongoose.connect(dburl).then(()=>{
    console.log('connected to database');
})
app.post('/signup',async(req,res)=>{
    user.findOne({email:req.bodey.email},async (err,userData)=>{
        if(userData){
            res.send({message:"seems like you already have an account with this eamil"})
        }else{
            const data=  new user({
                name:req.body.name,
                email:req.body.email,
                phonenumber:req.body.phonenumber,
                password:req.body.password
            })
            try{
                await data.save()
                res.send({message:"User registered successfully"})
            }catch(err){
                res.send(err)
            }
            // data.save(()=>{
            //     if(err){
            //         res.send(err)
            //     }else{
            //         res.send({message:"user regustered successfully"})
            //     }
            // })
        }
    })
    
})

app.listen(PORT,()=>{
    console.log(`listening to port ${PORT}`);
})