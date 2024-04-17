// initialization of all the dependancies
const port=4000;
const express=require("express");
const app = express();
const mongoose = require("mongoose");
const jwt= require("jsonwebtoken");
const multer= require("multer");
const path= require("path");
const cors= require("cors");
const dotenv = require('dotenv');
dotenv.config();
const BACKEND = process.env.BACKEND_URL;
const mongoURL = process.env.MONGO_URL;

app.use(express.json());   // by this all the request is pass through json
app.use(cors());    // using this our reactjs project frontend will connect to express app on "4000" port

// Database connection with mongodb
mongoose.connect(mongoURL);

// API Creation
app.get("/",(req,res)=>{
    res.send("Express app is running");
})

// img storage engine (in this we create disk storage through multer)
const storage=multer.diskStorage({
    destination:'./upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`) // by this we will get file name of original file
    }
})

const upload=multer({
    storage:storage
})

// creating upload endpoint for images

app.use('/images',express.static('upload/images'))  // make for to provide image_url in res.json by this we will get images at /images endpoint

app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`${BACKEND}/images/${req.file.filename}`    // using this url we can access the uploaded img
    });
})

// create endpoint using that we can add the product in our mongodb atlas database so for that we need to create a schema using the mongoose library : (Schema for creating products)
const Product=mongoose.model("Product",{
    id:{
        type: Number,
        required: true,
    },
    name:{
        type: String,
        required: true,  // if we upload product without name it won't be uploaded
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type: String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true,
    },
})

app.post('/addproduct',async (req,res)=>{

    // build a logic for providing id of the product automatically
    let products=await Product.find({});    // it will return array of complete product
    let id;
    if(products.length>0)
    {
        let last_product_array=products.slice(-1);   // it will provide one product from the array that is the last product
        let last_product=last_product_array[0];
        id=last_product.id+1;   // this will generate id from the previous product id so, it is prev_prod_id+1
    }
    else{
        id=1;   // if no prev_prod then id=1
    }

    const product=new Product({
        id: id,     // id which is generated from the above logic
        name:req.body.name,
        image:req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    });
    console.log(product);

    // to save this product into the mongodb database
    await product.save();

    console.log("saved!!!");

    // generate a responce for the frontend
    res.json({
        success:true,
        name: req.body.name,
    })
})


// creating an api for deleting product
app.post('/removeproduct',async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});

    console.log("deleted!!!");
    res.json({
        success:true,
        name: req.body.name,    // name of removed product
    })
})


// creating an endpoint using that we get all the products available in db. and using that we can display all that products on frontend : (creating api for getting all products)
app.get('/allproducts', async (req,res)=>{
    let products= await Product.find({});

    console.log("all prod. fatched!!!");
    res.send(products);  // response for the frontend
})

// create a api for user creation (schema creation for user model)
const Users= mongoose.model('Users', {
    // define the structure of the user
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})
// creating endpoint for registering the user
app.post('/signup', async (req,res)=>{
    // check that email id and password we are getting that are available in the database or not
    let check=await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false, errors:"Existing user found with same email id!"})
    }
    let cart={};
    for (let i = 0; i < 301; i++) {
        cart[i]=0;
    }

    const user=new Users({
        name : req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData : cart,
    })

    await user.save();  // here we will save the user's data

    // now we will do the jwt authentication
    const data = {
        // in this we will create one key
        user:{
            id:user.id
        }
    }
    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true, token})
})

// creating endpoint for user login
app.post('/login',async (req,res)=>{
    let user=await Users.findOne({email:req.body.email});
    if(user){
        const passCompare= req.body.password === user.password;
        if(passCompare)
        {
            const data={
                user:{
                    id:user.id
                }
            }
            const token=jwt.sign(data, 'secret_ecom');
            res.json({success:true,token});
        }
        else{
            res.json({success:false, errors:"Wrong Password!"});
        }
    }
    else{
        res.json({success:false, errors:"Wrong Email Id!"});
    }
})

// creating endpoint for newcollection data
app.get('/newcollections', async (req,res)=>{
    let products=await Product.find({});
    let newcollection=products.slice(1).slice(-8);

    console.log("newcollection fetched!");
    res.send(newcollection);
})

// creating endpoint for popular in women section
app.get('/popularinwomen',async (req,res)=>{
    let products=await Product.find({category:"Women"});
    let popularinwomen=products.slice(0,4);

    console.log("popularinwomen fetched!");
    res.send(popularinwomen);
})

// creating middleware to fetch user
const fetchUser=async (req,res,next)=>{
    const token=req.header('auth-token');
    if(!token){
        res.status(401).send({errors:"Please authenticate using valid token"});
    }
    else{
        try {
            // decode the token
            const data=jwt.verify(token,'secret_ecom');
            req.user=data.user;
            next();
        } catch (error) {
            res.status(401).send({errors:"Please authenticate using valid token"});
        }
    }
}

// creating endpoint for adding products in cartdata
app.post('/addtocart', fetchUser, async (req,res)=>{
    // console.log(req.body,req.user);
    console.log("Added",req.body.itemId);

    let userData=await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId]+=1;

    // save the data in mongodb
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Added");
})

// creating endpoint to remove product from cartdata
app.post('/removefromcart', fetchUser, async (req,res)=>{
    console.log("Removed",req.body.itemId);
    let userData=await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    {
        userData.cartData[req.body.itemId]-=1;
    }

    // save the data in mongodb
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Removed");
})

// creating endpoint to get cartdata, when we are logged in
app.post('/getcart',fetchUser, async (req,res)=>{
    console.log("Get cart");
    let userData=await Users.findOne({_id:req.user.id})
    res.json(userData.cartData);
})


// by this we can run our backend server
app.listen(port,(error)=>{
    if(!error){
        console.log("Server running on port : "+port)
    }
    else {
        console.log("Error : "+error)
    }
})