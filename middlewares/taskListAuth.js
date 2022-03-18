const ListModel = require('../model/listsModel')

const verifyAvailableLists=async(req,res,next)=>{
    const {idTeam} = req.params
    const {idList} = req.body
    // TODO: Hacer una condicion pára que me traiga exactamente el que quiero
    const listasEquipos = await ListModel.find({idTeam,_id:idList})
    console.log(listasEquipos)
}