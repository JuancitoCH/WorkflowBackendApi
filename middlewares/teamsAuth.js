const TeamsModel = require("../model/teamsModel")
const ListModel = require('../model/listsModel')
const TasksModel = require('../model/tasksModel')


const rolesToNumericValue = (role) => {
    if (role === "leader") return 10
    if (role === "editor") return 5
    if (role === "validator") return 3
    if (role === "normal") return 1
    return 0
}

// IMPORTANT: El id del team tiene que ser declarado en los params para que funcione actualemente


const TeamVerify = async (req, res, next, idTeam, role) => {
    try {
        const team = await TeamsModel.findById(idTeam)
        if (!team) return res.json({ success: false, message: "Must specify an existance team" })
        req.teamMembers = team.members
        req.teamLeader = team.leader.valueOf()

        let userBool
        if (req.userData.id === team.leader.valueOf()) return next()
        team.members.forEach(member => {
            if (member._id.valueOf() === req.userData.id && rolesToNumericValue(member.role) >= rolesToNumericValue(role)) return userBool = true
        })
        if (userBool) return next()

        return res.json({ success: false, message: "User Dont Have permissions" })
    }
    catch (err) {
        return res.json({ success: false, message: err.message })
    }
}

const isLeaderTeam = async (req, res, next) => {
    await TeamVerify(req, res, next, req.params.id, "leader")
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


const searchAvailableList=async (req,res,next,idTeam,idList)=>{
    try {
        const listasEquipos = await ListModel.findOne({ idTeam, _id: idList })
        if (!listasEquipos) return res.json({ success: false, message: "the list on the team dont exist" })
        next()
    }
    catch (err) {
        return res.json({ success: false, error: err.message })
    }
}

const verifyAvailableLists = async (req, res, next) => {
    const { idTeam } = req.params
    const { idList,idTask } = req.body
    await searchAvailableList(req,res,next,idTeam,idList)
}

const verifyTaskAndList = async (req, res, next) => {
    const { idTeam } = req.params
    const { idTask } = req.body
    if(idTask){
        try{
            const task = await TasksModel.findById(idTask)
            if(!task) return res.json({ success: false, message: "Task dont exist" })
            req.task = task
            await searchAvailableList(req,res,next,idTeam,task.idList)
        }
        catch(err){
            return res.json({ success: false, error: err.message })
        }
    }
    if(!idTask) return res.json({ success: false, message: "'idTask' is not include in the credentials" })
    
}


module.exports = { isEditorTeam, verifyAvailableLists, isUserTeam, isValidatorTeam,verifyTaskAndList }