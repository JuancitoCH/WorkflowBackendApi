const TasksModel = require('../model/tasksModel')
const ComentsModel = require('../model/comentariosTasksModel')

class Tasks {
    validateTask(task) {
        const res = task.validateSync()
        if (res) {
            const errors = Object.keys(res.errors).map(path => {
                return (`Error in '${path}' : it must be '${res.errors[path].kind}' and the value '${res.errors[path].value}' not match the conditions`)
            })
            return { errors, error: true }
        }
        return { error: false }
    }

    async createTask(taskData) {
        const task = new TasksModel(taskData)
        const validate = this.validateTask(task)
        if (validate.error) return validate
        return await task.save()
    }
    async getTask(idList, idUser, listasDeMiembros, leader) {
        if (idUser === leader.valueOf()) return await TasksModel.find({ idList }).populate("members","email userPhoto").populate('comments')
        let usuarioEditor
        listasDeMiembros.forEach(member => {
            if (member._id.valueOf() === idUser && member.role === "editor") return usuarioEditor = true
        });
        if (usuarioEditor) return await TasksModel.find({ idList })
        return await TasksModel.find({ idList, "members": idUser }).populate("members","email userPhoto")
    }
    async updateStateOfTask(idTask) {
        // porcua entre corchetes si funciona la query?????????
        // se supone que es por usar update pipeline 
        // pero no se muy bien como funciona
        // https://docs.mongodb.com/manual/reference/method/db.collection.updateOne/#mongodb-method-db.collection.updateOne
        // https://platzi.com/contributions/introduccion-al-pipeline-de-agregacion-de-mongodb/?gclid=CjwKCAjw_tWRBhAwEiwALxFPoZCIKIewhs5s2wZGRLoZglwEZkoL5gk3u-dDc2duClv-6cT_NHIHdxoCSxYQAvD_BwE&gclsrc=aw.ds
        return await TasksModel.findByIdAndUpdate(idTask, [{ $set: { state: { $not: "$state" } } }], { new: true })
    }
    async updateGlobalTask(idTask,taskData) {
        
        try{
            return await TasksModel.findByIdAndUpdate(idTask, taskData,{new:true})
        }
        catch(err){
            return {success:false,message:err.message}
        }
    }
    async addMember(idTask, idUser, teamMembers) {
        let userOnTheTeam
        teamMembers.map(user => { if (user._id.valueOf() === idUser) return userOnTheTeam = true })
        if (userOnTheTeam) return await TasksModel.findByIdAndUpdate(idTask, { $push: { members: idUser } }, { new: true })
        return { success: false, message: "User is not on the team" }

    }
    async deleteMember(idTask, idUser) {
        try{

            return await TasksModel.findByIdAndUpdate(idTask, { $pull: { "members": idUser } },{new:true})
        }
        catch(err){
            return {success:false,message:err.message}
        }
    }

    // comentarios
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




module.exports = Tasks