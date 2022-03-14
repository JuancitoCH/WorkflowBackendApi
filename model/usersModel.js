const {mongoose} = require('../config/dbConnection')
const {Schema} = mongoose

const UserShema = new Schema({
    userName:{
        type:String,
        trim:true
    },
    password:String,
    userPhoto:String,
    rol:{type:Number,default:0},
    email:{type:String,unique:true,trim:true},
})

const UserModel = mongoose.model('users',UserShema)
module.exports = UserModel