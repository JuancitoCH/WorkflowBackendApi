const jwt = require('jsonwebtoken')
const {jwt_secret} = require('../config/envVars')
const GoogleStrategy = require('passport-google-oauth20')
const configV = require('../config/envVars')

const Permisos=(rol,req,res,next)=>{
    try{
        const {token} = req.cookies
        if(!token)  return res.json({success:false,message:"token is require"})
        const userData = jwt.verify(token,jwt_secret)
        if(userData.rol<rol) return res.json({success:false,message:"you don't have permissions"})
        // console.log(userData)
        // aqui guardamos cada vez que el
        // middelware sea llamado y tengo la data del user a mano
        req.userData = userData
        next()
    }
    catch(e){
        console.log(e.message)
        return res.status(403).json({success:false,message:e.message})
    }
}
const isAdmin=(req,res,next)=>{
    const rol = 10
    Permisos(rol,req,res,next)
}
const isUser=(req,res,next)=>{
    const rol = 1
    Permisos(rol,req,res,next)
}
const isEditor=(req,res,next)=>{
    const rol = 5
    Permisos(rol,req,res,next)
}


const GoogleStrategyAuth=()=>{
    return new GoogleStrategy({
        clientID: configV.oauth_client_id,
        clientSecret: configV.oauth_client_secret,
        callbackURL: configV.oauth_callback_url
    },(accessToken,refreshToken,profile,done)=>{
        // console.log({accessToken,refreshToken,profile})
        done(null,{profile})
        }
    )
}


module.exports = {isAdmin,isUser,isEditor,GoogleStrategyAuth}