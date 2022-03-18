const { mongoose } = require('../config/dbConnection')
const { Schema } = mongoose

const TasksSchema = new Schema({
    idList: {type: mongoose.Schema.Types.ObjectId,
        ref: "lists", required:true},
    name: {type:String, required:true,message:"se requiere el {VALUE}"},
    description: {type:String, required:true},
    state: { type: Boolean, default: false },
    members: [{
        idUser: String
    }]
    //task
})



const TasksModel = mongoose.model('tasks', TasksSchema)
module.exports = TasksModel