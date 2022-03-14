const mongoose = require('mongoose')
const configV = require('./envVars')

const connection = async ()=>{
    try{

        const conn = await mongoose.connect(`mongodb+srv://${configV.db_userName}:${configV.db_password}@${configV.db_host}/${configV.db_name}`)
        console.log('MongoDb connected '+conn.connection.host)
    }
    catch(e){
        console.log(e.message)
    }
}

module.exports = {connection,mongoose}