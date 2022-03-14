const TeamsModel = require('../model/teamsModel')

class Teams{

    async createTeam(leader,data){
        const team = await TeamsModel.create({...data,leader,members:[leader]})
        return team
    }
    async getTeamsForIdUser(idUser){
        const teams = await TeamsModel.find({members:idUser})
        .populate("members","userName Email")
        .populate("editors","userName Email")
        .populate("leader","userName Email")
        // .populate("idLeader")
        return teams
    }
    async addTeamMember(idTeam,{idUser,rol}){
        const team = await TeamsModel.findOne({_id:idTeam,members:{$all:[idUser]}})
        if(team) return {success:false,message:"The User Alredy Exist"}
        const teamUpdated = await TeamsModel.findByIdAndUpdate(idTeam,{ $push:{ members:idUser } } ,{new:true})
        return {succes:true,team:teamUpdated}
    }
    async updateMemberRol({id:idUserLeader},idTeam,{idUser:idUserToUpdate,rol}){
        
        const {leader} = await TeamsModel.findById(idTeam)
        //TODO:No se Mantengan usuarios repetidos
        if(idUserLeader!==leader.valueOf()) return {success:false,message:"you dont have the permisions"}
        if(rol==="editor") return await TeamsModel.findByIdAndUpdate(idTeam,{ $push:{ editors:idUserToUpdate } },{new:true} )
        if(rol==="validator") return await TeamsModel.findByIdAndUpdate(idTeam,{ $push:{ validator:idUserToUpdate } },{new:true} )
        if(rol==="leader") return await TeamsModel.findByIdAndUpdate(idTeam,{ leader:idUserToUpdate } ,{new:true})
        return {message:"te as equivocao"}
    }

}

module.exports=Teams
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