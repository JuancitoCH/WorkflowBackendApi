const express = require('express')
const router = express.Router()
const { uploadFile,downloadFile } = require('../libs/storage')
//servicios
const {isUser} = require('../middlewares/auth')
const upload = require('../middlewares/upload')


const files =(app)=>{
    //middleware
    app.use('/uploads',router)

    router.post('/file',isUser,upload.single("img"),async (req,res)=>{
        const storageResponse = await uploadFile(req.file.originalname,req.file.buffer)
        
        return res.json(storageResponse)
    })

    router.get('/file/filename/:fileName',isUser,async (req,res)=>{
        await downloadFile(req.params.fileName,res)
    })
   
}

module.exports= files