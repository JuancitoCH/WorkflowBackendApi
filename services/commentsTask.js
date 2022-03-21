const ComentsModel = require('../model/comentariosTasksModel')

class Comment{
    async commentTask(idTask,comment,member,document=""){
        return await ComentsModel.create({idTask,comment,member,document})
    }
    async getCommentTask(idComment){
        return await ComentsModel.findById(idComment)
    }
    async deleteCommentTask(idComment,idUser){
        const comment =await this.getCommentTask(idComment)
        if(comment.member.valueOf()===idUser) return await ComentsModel.findByIdAndDelete(idComment)
        return {success:false,message:"You dont have permisions"}
        
    }
}

module.exports = Comment