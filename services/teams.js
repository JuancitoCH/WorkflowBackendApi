const TeamsModel = require('../model/teamsModel')

class Teams {

    async createTeam(leader, data) {
        const team = await TeamsModel.create({ ...data, leader, members: [{ _id: leader }] })
        return team
    }
    async getTeamsForIdUser(idUser) {
        const teams = await TeamsModel.find({ members: { $elemMatch: { _id: idUser } } })
            .populate("members._id", "userName email")
            // .populate("editors","userName Email")
            .populate("leader", "userName email")
        // .populate("idLeader")
        return teams
    }
    async addTeamMember({ id: idUserLeader }, idTeam, { idUser, rol }) {

        const { leader } = await TeamsModel.findById(idTeam)
        if (idUserLeader !== leader.valueOf()) return { success: false, message: "you dont have the permisions" }

        const team = await TeamsModel.findOne({ _id: idTeam, "members._id": { $all: [idUser] } })
        if (team) return { success: false, message: "The User Alredy Exist" }
        const teamUpdated = await TeamsModel.findByIdAndUpdate(idTeam, { $push: { members: { _id: idUser } } }, { new: true })
        return { succes: true, team: teamUpdated }
    }
    async updateMemberRol({ id: idUserLeader }, idTeam, { idUser: idUserToUpdate, role: newRole }) {

        const { leader } = await TeamsModel.findById(idTeam)
        //TODO:No se Mantengan usuarios repetidos
        if (idUserLeader !== leader.valueOf()) return { success: false, message: "you dont have the permisions" }
        if (newRole === "leader") return await TeamsModel.findByIdAndUpdate(idTeam, { leader: idUserToUpdate }, { new: true })
        const teamUpdated =await TeamsModel.findByIdAndUpdate(idTeam, { $set: { "members.$[idUser].role": newRole } }, { new:true ,arrayFilters: [{ "idUser._id": idUserToUpdate }] } )
        return {succes:true,teamUpdated}

        // return { message: "te as equivocao" }
    }
    async deleteMember({ id: idUserLeader },idTeam,{idUser}){
        
        const { leader } = await TeamsModel.findById(idTeam)
        if (idUserLeader !== leader.valueOf()) return { success: false, message: "you dont have the permisions" }
        const team = await TeamsModel.findByIdAndUpdate( idTeam , { $pull : { "members":{_id:idUser} } }, { new: true } )

        return {succes:true,team}
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