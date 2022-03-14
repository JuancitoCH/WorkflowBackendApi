const {mongoose} = require('../config/dbConnection')
const {Schema} = mongoose
const {normalRol}=require('../config/envVars')

const TeamsShema = new Schema({
    leader:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"},
    editors:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"}],
    name:String,
    img:String,
    description:String,
    members:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"users"}],
    list:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"}]
})

const TeamsModel = mongoose.model('teams',TeamsShema)
module.exports = TeamsModel
// {
//     roles: ["leader","editor","validator","normal"]
// }