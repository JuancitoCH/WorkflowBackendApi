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
}

module.exports = Tasks