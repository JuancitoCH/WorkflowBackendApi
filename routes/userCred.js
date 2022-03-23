const express = require('express')
const router = express.Router()
const resCookie = require('../helper/resCookieUser')
//passport
const passport = require('passport')
const {GoogleStrategyAuth, isAdmin, isUser} = require('../middlewares/auth')
//servicios
const Auth = require('../services/auth')


const userCred =(app)=>{
    
    const authService = new Auth()
    app.use('/authenticate',router)

    passport.use(GoogleStrategyAuth())


    router.post('/login',async(req,res)=>{
        const user = await authService.loginUser(req.body)
        return resCookie(res,user)
        // return res.json({message:"Hola"})
    })
    
    router.post('/logged',isUser,async(req,res)=>{
        return res.json({logged:true,success:true,user:req.userData})
    })
    

    router.get('/logout',async(req,res)=>{
        return res.cookie('token',"",{
            httpOnly:true,
            secure:true,
            sameSite:'none',
            expires:new Date()
        }).json({success:true, message:"deslogeado",logout:true})
    })

    router.post('/register',async(req,res)=>{
        const user = await authService.registerUser(req.body)
        return resCookie(res,user)
    })
    router.get('/register/validate/:token',async(req,res)=>{
        // console.log(req.params.token)
        const response =authService.confirmRegister(req.params.token)
        // console.log(response)
        return res.json(response)
    })
    
    //passport----------------------------------------

    passport.serializeUser((user,done)=>{done(null,user)})

    router.get('/google',passport.authenticate('google', { scope: ['profile','email'] }));
    router.get('/google/callback',passport.authenticate('google'),
    async (req, res)=> {
        const user = await authService.loginProvider(req.user)
        return resCookie(res,user)
    });

    
}
module.exports= userCred