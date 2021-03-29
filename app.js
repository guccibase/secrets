const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const encrypt = require("mongoose-encryption");
const app = express();

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({
    extended:true
}));

mongoose.connect("mongodb://localhost:27017/userDB",{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

const userSchema = new mongoose.Schema( {
    email:String,
    password:String
});

const secret = "thisismysecret";

userSchema.plugin(encrypt,{secret:secret,encryptedFields:["password"]});


const User = new mongoose.model("User",userSchema);



app.listen(3000,(reg,res)=>{
    console.log("listening on 3000");
})


app.get("/",(req,res)=>res.render("home"))

app.get("/login", (req, res) => res.render("login"))

app.get("/register", (req, res) => res.render("register"))


app.post("/register",(req,res)=>{
    const newUser = new User({
        email:req.body.username,
        password:req.body.password
    })


    newUser.save((err)=>{
        if(err){
            console.log(err);
        }else{
            console.log("Success creating a new user with name " + req.body.username);
            res.render("secrets");
        }
    })

})

app.post("/login",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({username:username},(err,doc)=>{
        if(err){
            console.log(err);
        }else{
            if(doc.password === password){
                res.render("secrets");
            }else{
                res.render("login");
            }
        }
    })
})

app.get("/submit",(req,res)=>{
    res.render("submit")
})

app.post("/submit", (req, res) => {
    const secret = req.body.secret;
    console.log(secret);
    res.render("submit")

})