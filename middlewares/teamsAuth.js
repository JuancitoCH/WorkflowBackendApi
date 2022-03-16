const TeamsModel = require("../model/teamsModel")

// TODO: Usar promesas para el middelware
const TeamVerify= (req,res,next,idTeam,role)=>{
    TeamsModel.findById(idTeam)
    .then(team=>{
        if(!team) return res.json({success:false, message:"Must specify an existance team"})
        return team
    })
    .then(team=>{
        let userBool
        if(req.userData.id === team.leader.valueOf()) return next()
        team.members.foreach(member=>{if(member._id === req.userData.id && member.role === role) return userBool=true})
        if(userBool) return next()
        return res.json({success:false, message:"User Dont Have permissions"})
    })

}

// const isLeaderTeam=(req,res,next)=>{
//     TeamVerify(req,res,next,req.params.id,"leader")
// }
const isEditorTeam=(req,res,next)=>{
    TeamVerify(req,res,next,req.params.id,"editor")
}
// const isValidatorTeam=(req,res,next)=>{
//     const {leader} = await TeamsModel.findById(idTeam)
//     if(idUserLeader!==leader.valueOf()) return {success:false,message:"you dont have the permisions"}
//     next()
// }
// const isUserTeam=(req,res,next)=>{
//     const {leader} = await TeamsModel.findById(idTeam)
//     if(idUserLeader!==leader.valueOf()) return {success:false,message:"you dont have the permisions"}
//     next()
// }

module.exports={isEditorTeam}