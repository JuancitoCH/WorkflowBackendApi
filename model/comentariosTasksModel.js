const { mongoose } = require('../config/dbConnection')
const { Schema } = mongoose

const ComentsSchema = new Schema({
    idTask: String,
    name: String,
    description: String,
    state: { type: Boolean, default: false },
    members: [{
        idUser: String
    }]
    //task
})



const ComentsModel = mongoose.model('coments', ComentsSchema)
module.exports = ComentsModel