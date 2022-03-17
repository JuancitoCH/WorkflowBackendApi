const TeamsModel = require("../model/teamsModel")

// IMPORTANT: El id del team tiene que ser declarado en los params para que funcione actualemente
const TeamVerify = async (req, res, next, idTeam, role) => {
    const team = await TeamsModel.findById(idTeam)
    if (!team) return res.json({ success: false, message: "Must specify an existance team" })
    console.log(team)
    let userBool
    if (req.userData.id === team.leader.valueOf()) return next()
    team.members.forEach(member => { if (member._id === req.userData.id && member.role === role) return userBool = true })
    if (userBool) return next()
    return res.json({ success: false, message: "User Dont Have permissions" })
}

const isLeaderTeam=async(req,res,next)=>{
    await TeamVerify(req,res,next,req.params.id,"leader")
}
const isEditorTeam = async (req, res, next) => {
    await TeamVerify(req, res, next, req.params.idTeam, "editor")
}
const isValidatorTeam = async (req, res, next) => {
    await TeamVerify(req, res, next, req.params.idTeam, "validator")
}
const isUserTeam = async (req, res, next) => {
    await TeamVerify(req, res, next, req.params.idTeam, "normal")
}


module.exports = { isEditorTeam }