const UserModel = require('../model/usersModel')

class UserService {
    async createUser(userData){
        return await UserModel.create(userData)
    }
    async getUsers(){
        return await UserModel.find()
    }
    async getUserByEmail(email){
        return await UserModel.findOne({email:email})
    }
    async getUserByid(idUser){
        return await UserModel.findById(idUser)
    }
    async deleteUser(id){
        return await UserModel.findByIdAndDelete(id)
    }
    async updateUser(id,data){
        return await UserModel.findByIdAndUpdate(id,data,{new:true})
    }
    async getUserByEmailForShare(email){
        if(!email) return {success:false,message:"You must include credentials"}
        const user = await UserModel.findOne({email})
        if(!user) return {success:false,message:"User Dont exist"}
        return {
            _id:user._id,
            email:user.email,
            userName:user.userName
     
        }
    }
}
module.exports = UserService