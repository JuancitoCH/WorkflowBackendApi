const ComentsModel = require('../model/comentariosTasksModel')
const Task = require('./tasks')
class Comment{
    async commentTask(idTask,comment,member,document=""){
        const taskService = new Task()
        const commentInfo = await ComentsModel.create({idTask,comment,member,document})
        // console.log(commentInfo)
        return await taskService.updateGlobalTask(idTask,{$push:{comments:[commentInfo._id]}},{new:true})
        
    }
    async getCommentTask(idComment){
        return await ComentsModel.findById(idComment).populate('member','email photo userName')
    }
    async deleteCommentTask(idComment,idUser){
        const taskService = new Task()

        const comment =await ComentsModel.findById(idComment)
        console.log(comment)
        if(comment.member.valueOf()===idUser){
            await ComentsModel.findByIdAndDelete(idComment)
            return await taskService.updateGlobalTask(comment.idTask,{$pull:{comment:[comment._id]}})
        } 
        return {success:false,message:"You dont have permisions"}
        
    }
}

module.exports = Comment