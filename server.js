const express = require('express')
// routes
const user = require('./routes/user')
const userCred = require ('./routes/userCred')
//config
const configV = require('./config/envVars')
const {connection:db} = require('./config/dbConnection')
//middelWares
const cookies = require('cookie-parser')
const cors = require('cors')
const teamsManage = require('./routes/teamsManage')

const app = express()

//middelWares
app.use(express.json())
app.use(cookies())
app.use(cors({
    origin:['http://localhost:3000'],
    credentials:true
}))

//databaseconection
db()

//routes
userCred(app)
user(app)
teamsManage(app)

//url gets
app.get('/',(req,res)=>{
    return res.send("Server")
})

app.listen(configV.port,()=>{
    console.log("Server en Port")
    console.log("http://localhost:" + configV.port)
})

