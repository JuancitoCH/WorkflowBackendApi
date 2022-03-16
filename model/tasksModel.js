const { mongoose } = require('../config/dbConnection')
const { Schema } = mongoose

const TasksSchema = new Schema({
    idList: String,
    name: String,
    description: String,
    state: { type: Boolean, default: false },
    members: [{
        idUser: String
    }]
    //task
})



const TasksModel = mongoose.model('tasks', TasksSchema)
module.exports = TasksModel