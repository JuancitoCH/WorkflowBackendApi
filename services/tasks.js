const TasksModel = require('../model/tasksModel')

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
    async getTask(idList,idUser,listasDeMiembros,leader){
        if(idUser===leader.valueOf()) return await TasksModel.find({idList})
        let usuarioEditor
        listasDeMiembros.forEach(member => {
            if(member._id.valueOf() === idUser && member.role==="editor") return usuarioEditor=true
        });
        if(usuarioEditor) return await TasksModel.find({idList})
        return await TasksModel.find({idList,"members._id":idUser})
    }
}

module.exports = Tasks