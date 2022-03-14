require('dotenv').config()
const resCookie=(res,{token,message,success,user})=>{
    let date = new Date(new Date().setDate(new Date().getDate()+7))
    
    if(process.env.NODE_ENV === "dev"){
        return res.cookie('token',token,{
        httpOnly:true,
        // secure:true,
        // sameSite:'none',
            expires:date
        }).json({success,message,user})
    }

    return res.cookie('token',token,{
        httpOnly:true,
        secure:true,
        sameSite:'none',
        expires:date
    }).json({success,message,user})
}
module.exports = resCookie