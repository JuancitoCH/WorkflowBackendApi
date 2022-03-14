const {mongoose} = require('../config/dbConnection')
const {Schema} = mongoose

const ListsSchema = new Schema({
    title:String,
    photo:String,
    description:String,
})



const ListsModel = mongoose.model('lists',ListsSchema)
module.exports = ListsModel