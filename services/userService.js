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
    async deleteUser(id){
        return await UserModel.findByIdAndDelete(id)
    }
    async updateUser(id,data){
        return await UserModel.findByIdAndUpdate(id,data,{new:true})
    }
}
module.exports = UserService