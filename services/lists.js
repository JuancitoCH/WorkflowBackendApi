const ListsModel = require('../model/listsModel')
const Teams = require('./teams')
class Lists {
    constructor(){
        this.TeamsService = new Teams()
        // si creo una lista verifico si existe o si existe para el usuario?
        // el servicio de los equipos los pongo aqui o los separo ?
        // tengo que crear mas rutas en los teams
    }
    async getLists(){
        return await ListsModel.find()
    }
    async getListById(idList){
        return await ListsModel.findById(idList)
    }
    async delList(idList){
        try{

            return await ListsModel.findByIdAndDelete(idList)
        }
        catch(e){
            return {error:e.message}
        }
    }


    async getListsByTeam(idTeam){
        return await ListsModel.find({idTeam})
    }
    
    
    async createList(idTeam,listData){
        return await ListsModel.create({...listData,idTeam,date:new Date()})
    }
    
    async createListVerify(idTeam,listData){
        if(!idTeam) return {success:false, message:"Must specify the team"}
        const team = await this.TeamsService.getOneTeam(idTeam)
        if(!team) return {success:false, message:"Must specify an existance team"}
        
        return await ListsModel.create({...listData,idTeam,date:new Date()})
    }
    
    
}
module.exports = Lists

// async getListsByTeamUserVerify(idTeam,idUser){
//     let userBool
//     const team = await this.TeamsService.getOneTeam(idTeam)
//     if(!team) return {success:false, message:"Team not found"}
//     if(idUser !== team.leader.valueOf()){
//         team.members.forEach(member=>{if(member._id.valueOf() === idUser) userBool=true})
//     }
//     if(idUser === team.leader.valueOf()) userBool=true
//     if(!userBool) return {success:false, message:"user not found on the team"}
//     return await ListsModel.find({idTeam})
// }