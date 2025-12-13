const express = require('express');
const app = express();
const cors = require('cors');
const { hashSync, compareSync } = require('bcryptjs')
const { connectDB, UserModel } = require("./config/database");

const jwt = require('jsonwebtoken')
const passport = require('passport');


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors({
  origin: "https://task-manager-f-zeta.vercel.app",
  credentials: true
}));


app.use(passport.initialize());
connectDB();
require('./config/passport')

app.post('/register', async (req, res) => {
    try{
        const { email , password } = req.body;
        console.log(req.body.email);

        if(!email || !password){
            return res.status(400).send({
                message: "please fill all the credentials"
            })
        }

        const existing = await UserModel.findOne({ email });
        if(existing){
            return res.status(400).send({
                success: false,
                message: "user already exists"
            })
        }
        await UserModel.create({ email, password: hashSync(password , 10)});
        return res.status(201).send({
            success: true,
            message: "user registered successfully"
        })  
    }catch(err){
        console.log(err);
        return res.status(500).send({
            success: false,
            message: "registration failed"
        })
    }
})

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: "please fill all the credentials"
            });
        }

        const user = await UserModel.findOne({ email });

        // if user not found
        if (!user) {
            return res.status(400).send({
                success: false,
                message: "user does not exist"
            });
        }

        // incorrect password
        if (!compareSync(password, user.password)) {
            return res.status(401).send({
                success: false,
                message: "Incorrect Password"
            });
        }

        const payload = {
            email: user.email,
            id: user._id
        };

        const token = jwt.sign(payload, "vikasisduniyakapapahe", { expiresIn: "1d" });

        return res.status(200).send({
            success: true,
            message: "Logged in successfully",
            token: "Bearer " + token
        });

    } catch (err) {
        console.log(err);
        return res.status(500).send({
            success: false,
            message: "Login failed"
        });
    }
});

app.get('/protected',passport.authenticate('jwt', {session : false}),(req,res) =>{
   return res.status(200).send({
        success : true,
        user :{
             id : req.user._id,
             email : req.user.email,
        }
    })
})


app.listen(9000, () => console.log("listening on port 9000"));
