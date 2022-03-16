const {mongoose} = require('../config/dbConnection')
const {Schema} = mongoose

const ListsSchema = new Schema({
    idTeam:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "teams",
        required:true
    },
    title:String,
    photo:String,
    description:String,
    date:Date,
})



const ListsModel = mongoose.model('lists',ListsSchema)
module.exports = ListsModel