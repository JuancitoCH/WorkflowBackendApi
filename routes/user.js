const express = require('express')
const router = express.Router()
//servicios
const auth = require('../services/auth')
const UserService = require('../services/userService')

const {isAdmin} = require('../middlewares/auth')

const user =(app)=>{
    const userService = new UserService()

    //middleware
    app.use('/user',router)

    router.get('/',isAdmin,async(req,res)=>{
        const usersAll = await userService.getUsers()
        return res.json(usersAll)
    })
    router.post('/create',isAdmin,async(req,res)=>{
        console.log(req.body)
        const userCreated = await userService.createUser(req.body)
        return res.status(201).json(userCreated)
    })
    router.post('/delete/:id',isAdmin,async(req,res)=>{
        const {id}=req.params
        
        const userDeleted = await userService.deleteUser(id)
        return res.status(201).json(userDeleted)
    })
    router.post('/update/:id',isAdmin,async(req,res)=>{
        const {id}=req.params
        const data = req.body
        const userUpdated = await userService.updateUser(id,data)
        return res.status(201).json(userUpdated)
    })
    
}

module.exports= user