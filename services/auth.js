const jwt = require('jsonwebtoken')
const {jwt_secret} = require('../config/envVars')
const UserService = require('./userService')
const bcrypt = require('bcrypt')
const sendEmail = require("../libs/email")


class Auth {
    constructor(){
        this.userService = new UserService()
    }
    // validate(data){
    //     //hay que crear un  new Model de users cuando la pasamos
    //     //y usar el metodo que tienen validateSync
    //     //pero no lo hare aqui
    // }

    async cryptPassword(password){
        const salt = await bcrypt.genSalt(10)
        const cryptPassword = await bcrypt.hash(password,salt)
        return cryptPassword
    }


    getToken(userData,message="",time="7d"){
        const user = {
            id:userData._id,
            userName:userData.userName,
            password:userData.password,
            userPhoto:userData.userPhoto,
            rol:userData.rol,
            email:userData.email
        }
        const token = jwt.sign(user,jwt_secret,{expiresIn:time})
        return {success:true,token,user,message:"Succefully " + message}
    }

    async registerUser(userData){
        const userExist = await this.userService.getUserByEmail(userData.email)
        if(userExist) return {success:false,message:"user alredy exist"}

        userData.password = await this.cryptPassword(userData.password)
        userData.rol=undefined
        
        const user = await this.userService.createUser(userData)
        
        const token = this.getToken(user,"register","1h")
        await sendEmail(user.email,"Registro exitoso","Bienvenido",`
        <h2>Verifica Tu correo</h1>
        <p>Tienes 1H</p>
        <br>
        <a href="${"http://localhost:4000/authenticate/register/validate/"+token.token}">Verify</a>
        `)

        return token
    }

    async loginUser({email,password}){
        if(!email || !password) return {success:false,message:"You must include Credentials"}
        const user = await this.userService.getUserByEmail(email)
        if(!user) return {success:false,message:"User not Register"}
        
        const passwordCompare = await bcrypt.compare(password,user.password)
        if(!passwordCompare) return {success:false,message:"Incorrect Password"}

        const token = this.getToken(user,"login")
        return token

    }
    async loginProvider({profile:{_json:data}}){
        
        const user = {
            userName:data.name,
            idProvider:data.sub,
            email:data.email,
            userPhoto:data.picture
        }
        const userDB=await this.userService.getUserByEmail(user.email)

        if(!userDB){
            const userCreate = await this.userService.createUser(user)
            const token = this.getToken(userCreate,"login")
            return token
        }
        const token = this.getToken(userDB,"login")
            return token

    }

    confirmRegister(token){
        let res
        const userData = jwt.verify(token,jwt_secret,(err,decoded)=>{
            if(err) return res = {message:"Token Vencido",success:false}
            this.userService.updateUser(decoded.id,{rol:1})
            return res = {message:"confirmado con exito",success:true}
        })
        return res
    }
}

module.exports = Auth