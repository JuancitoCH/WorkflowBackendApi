const { mongoose } = require('../config/dbConnection')
const { Schema } = mongoose

const ComentsSchema = new Schema({
    idTask: String,
    member:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required:true
    },
    comment:String,
    document:String
    //task
})



const ComentsModel = mongoose.model('comments', ComentsSchema)
module.exports = ComentsModel