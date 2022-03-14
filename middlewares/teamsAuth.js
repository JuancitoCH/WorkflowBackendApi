const TeamsModel = require("../model/teamsModel")

const isAdminTeam=(req,res,next)=>{
    const {leader} = await TeamsModel.findById(idTeam)
    if(idUserLeader!==leader.valueOf()) return {success:false,message:"you dont have the permisions"}
    next()
}
const isEditorTeam=(req,res,next)=>{
    const {leader} = await TeamsModel.findById(idTeam)
    if(idUserLeader!==leader.valueOf()) return {success:false,message:"you dont have the permisions"}
    next()
}
const isValidatorTeam=(req,res,next)=>{
    const {leader} = await TeamsModel.findById(idTeam)
    if(idUserLeader!==leader.valueOf()) return {success:false,message:"you dont have the permisions"}
    next()
}
const isUserTeam=(req,res,next)=>{
    const {leader} = await TeamsModel.findById(idTeam)
    if(idUserLeader!==leader.valueOf()) return {success:false,message:"you dont have the permisions"}
    next()
}

module.exports={isAdminTeam,isEditorTeam,isValidatorTeam,isUserTeam}