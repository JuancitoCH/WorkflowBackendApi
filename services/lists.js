const ListsModel = require('../model/listsModel')
const Teams = require('./teams')
class Lists {
    constructor(){
        this.TeamsService = new Teams()
        // si creo una lista verifico si existe o si existe para el usuario?
        // el servicio de los equipos los pongo aqui o los separo ?
        // tengo que crear mas rutas en los teams
    }
    async createList(idTeam,listData){
        return await ListsModel.create({...listData,idTeam,date:new Date()})
    }
    
}

module.exports = Lists