const { mongoose } = require('../config/dbConnection')
const { Schema } = mongoose
const { normalRol } = require('../config/envVars')

const TeamsShema = new Schema({
    leader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    name: String,
    img: String,
    description: String,
    members: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        },
        role: {
            type: String,
            enum: {values:["editor", "validator", "normal", "leader"], message:"{VALUE} is not suported" },
            default: "normal"
        }
    }],
    lists: [{ type: String }]
})

const TeamsModel = mongoose.model('teams', TeamsShema)
module.exports = TeamsModel
// {
//     roles: ["leader","editor","validator","normal"]
// }