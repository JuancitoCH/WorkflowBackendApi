const TeamsModel = require("../model/teamsModel")
const ListModel = require('../model/listsModel')



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


const verifyAvailableLists = async (req, res, next) => {
    const { idTeam } = req.params
    const { idList } = req.body
    // TODO: Hacer una condicion pára que me traiga exactamente el que quiero
    try {
        const listasEquipos = await ListModel.findOne({ idTeam, _id: idList })
        if (!listasEquipos) return res.json({ success: false, message: "the list on the team dont exist" })
        next()
    }
    catch (err) {
        return res.json({ success: false, error: err.message })
    }
    // console.log(listasEquipos)

}


module.exports = { isEditorTeam, verifyAvailableLists, isUserTeam, isValidatorTeam }