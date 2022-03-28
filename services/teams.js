const TeamsModel = require('../model/teamsModel')
// FIXME: mover los servicios que requieren de otro a un nuevo archivo servicio?
const { jwt_secret, url } = require('../config/envVars')
const sendEmail = require('../libs/email')
const jwt = require('jsonwebtoken')

class Teams {

    getToken(data, message = "", time = "1d") {
        const addTeamMember = {
            idTeam: data.idTeam,
            idUser: data.idUser
        }
        const token = jwt.sign(addTeamMember, jwt_secret, { expiresIn: time })
        return { success: true, token, message: "Succefully " + message }
    }
    confirmAddMember(token) {
        let res
        jwt.verify(token, jwt_secret, (err, decoded) => {
            if (err) return res = { message: "Token Vencido", success: false }
            this.updateMember(decoded.idTeam, decoded.idUser)
            return res = { message: "confirmado con exito", success: true }
        })
        return res
    }

    async sendEmailIdUser(email, data) {
        const urlParam = this.getToken(data)
        // console.log(urlParam)
        // console.log(email)
        await sendEmail(email, "Invitacion a Team", '',
            `<h1>Invitacion a team</h1>
        <p>Tienes un dia</p>
        <a href="${url}/teams/add/member/confirm/${urlParam.token}" >Aceptar Invitacion</a>
        `)
    }

    async createTeam(leader, data) {
        const team = await TeamsModel.create({ ...data, leader, members: [{ _id: leader }] })
        return team
    }
    async getOneTeam(idTeam) {
        return await TeamsModel.findById(idTeam)
    }
    async getTeamsForIdUser(idUser) {
        const teams = await TeamsModel.find({ members: { $elemMatch: { _id: idUser } } })
            .populate("members._id", "userName email")
            .populate("leader", "userName email")
        return teams
    }

    async updateMember(idTeam, idUser) {
        const teams = await TeamsModel.findByIdAndUpdate(idTeam, { $set: { "members.$[idUser].role": "normal" } }, { new: true, arrayFilters: [{ "idUser._id": idUser }] })
        return teams
    }


    // FIXME: Sacar autenticacion de leader, este se realiza fuera del servicio en el middleware

    async addTeamMember({ id: idUserLeader }, idTeam, { idUser }, email) {

        const { leader } = await TeamsModel.findById(idTeam)
        if (idUserLeader !== leader.valueOf()) return { success: false, message: "you dont have the permisions" }

        const team = await TeamsModel.findOne({ _id: idTeam, "members._id": { $all: [idUser] } })
        if (team) return { success: false, message: "The User Alredy Exist" }
        const teamUpdated = await TeamsModel.findByIdAndUpdate(idTeam, { $push: { members: { _id: idUser, role: "not" } } }, { new: true })
        await this.sendEmailIdUser(email, { idTeam, idUser })
        return { success: true, team: teamUpdated }
    }

    async updateMemberRol({ id: idUserLeader }, idTeam, { idUser: idUserToUpdate, role: newRole }) {

        const { leader } = await TeamsModel.findById(idTeam)

        if (idUserLeader !== leader.valueOf()) return { success: false, message: "you dont have the permisions" }
        if (newRole === "leader") return await TeamsModel.findByIdAndUpdate(idTeam, { leader: idUserToUpdate }, { new: true })
        const teamUpdated = await TeamsModel.findByIdAndUpdate(idTeam, { $set: { "members.$[idUser].role": newRole } }, { new: true, arrayFilters: [{ "idUser._id": idUserToUpdate }] })
        return { success: true, teamUpdated }
        
        // return { message: "te as equivocao" }
    }
    async deleteMember({ id: idUserLeader }, idTeam, { idUser }) {

        const { leader } = await TeamsModel.findById(idTeam)
        if (idUserLeader !== leader.valueOf()) return { success: false, message: "you dont have the permisions" }
        const team = await TeamsModel.findByIdAndUpdate(idTeam, { $pull: { "members": { _id: idUser } } }, { new: true })

        return { success: true, team }
    }
    async getUserRoleByTeam(idTeam,idUser){
        const team = await TeamsModel.findById(idTeam)
        if(idUser===team.leader.valueOf()) return "leader"
        let role
        team.members.map(member=>{
            if(member._id.valueOf()===idUser) role=member.role
        })
        return role
    }
   

}

module.exports = Teams
// https://dba.stackexchange.com/questions/157149/how-can-i-update-a-single-field-in-an-array-of-embedded-documents
// https://www.designcise.com/web/tutorial/how-to-remove-array-elements-in-a-specific-mongodb-document

        // async createTeam(idLeader,data){
        //     const team = await TeamsModel.create({...data,idLeader,members:[ { idUser:idLeader,teamRol:"leader" } ]})
        //     return team
        // }
        // async getTeamsForIdUser(idUser){
        //     const teams = await TeamsModel.find( { members:{  $elemMatch:{idUser} } } )
        //     .populate( { path:"members",populate:{ path: 'idUser' ,select:"userName email" } } )
        //     // .populate("idLeader")
        //     return teams
        // }
        // async addTeamMember(idTeam,memberData){
        //     const teamUpdated = await TeamsModel.findByIdAndUpdate(idTeam,{ $push:{ members: { ...memberData } } } ,{new:true})
        //     return teamUpdated
        // }