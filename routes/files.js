const express = require('express')
const router = express.Router()
const { uploadFile } = require('../libs/storage')
//servicios
const {isUser} = require('../middlewares/auth')
const upload = require('../middlewares/upload')


const files =(app)=>{
    //middleware
    app.use('/uploads',router)

    router.post('/file',isUser,upload.single("img"),async (req,res)=>{
        const algo = await uploadFile(req.file.originalname,req.file.buffer)
        console.log(algo)
        return res.end()
    })
   
}

module.exports= files