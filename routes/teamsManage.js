const express = require('express')
const router = express.Router()
const {isUser,isAdmin} = require('../middlewares/auth')
const Teams = require('../services/teams')
const teamsManage =(app)=>{
    //middleware
    app.use('/teams',router)

    const TeamsService = new Teams()


    router.get('/',isUser,async(req,res)=>{
        const response = await TeamsService.getTeamsForIdUser(req.userData.id)
        return res.json(response)
    })
    router.post('/create/team',isUser,async(req,res)=>{
        const response = await TeamsService.createTeam(req.userData.id,req.body)
        return res.json(response)
    })
    router.post('/add/member/:idTeam',isUser,async(req,res)=>{
        const {idTeam} = req.params
        const response = await TeamsService.addTeamMember(idTeam,req.body)
        return res.json(response)
    })
    router.post('/update/member/:idTeam',isUser,async(req,res)=>{
        const {idTeam} = req.params
        const response = await TeamsService.updateMemberRol(req.userData,idTeam,req.body)
        return res.json(response)
    })

    router.post('/create/teamlist/:idTeam',isUser,async(req,res)=>{
        const {idTeam} = req.params
        // TODO:
        // crear lista a partir del id del team
        return res.status(200).json({message:"algo"})
    })
    router.post('/create/task/:idList',isUser,async(req,res)=>{
        const {idList} = req.params
        // TODO:
        // crear tarea a partir del id de la lista
        // y el id del usuario
        return res.status(200).json({message:"algo"})
    })
    
}

module.exports= teamsManage