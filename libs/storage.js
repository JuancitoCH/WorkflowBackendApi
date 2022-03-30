const {Storage} = require("@google-cloud/storage")
const {Readable} = require("stream")
const { bucket_name } = require("../config/envVars")
const uuid = require("uuid")
const path = require("path")

const storage = new Storage({
    keyFilename:"credentials-gcloud.json"
})

//storage.bucket("archivos_aplicacion").upload("",{})


const uploadFile = (fileName,buffer)=>{

    if(!fileName || !buffer){
        return {success:false,message:"A file is necessary"}
    }
    
    // obtenemos la .extension del archivo
    const ext = path.extname(fileName)
    // asignamos un uniqname con la extension del archivo de nombre
    const uuidFileName = uuid.v4()+ext


    //Referencia al objeto de archivo en google cloud
    const file = storage.bucket(bucket_name).file(uuidFileName)

    // convertimos el buffer que nos envia multer a readable
    const stream = Readable.from(buffer)


    // mirar apuntes porque las promesas no las cazo bien aun
    return new Promise((resolve,reject)=>{
        // pipe envia el stream a lo que especifiquemos dentro
        stream.pipe(file.createWriteStream())
        .on("finish",()=>{
            resolve({success:true,message:"File uploaded succesfully",fileName:uuidFileName})
        })
        .on("error",(err)=>{
            console.log(err)
            reject({success:false,message:"An error ocurred"})
        })
    })
}



const downloadFile = (fileName,res)=>{
    //Referencia al objeto de archivo en google cloud
    const file = storage.bucket(bucket_name).file(fileName)
    const stream = file.createReadStream()
    .on("error",(error)=>{
        if(error.code===404){
            res.status(error.code).json({error:true,message:"No se encontró el archivo"})
        }
    }) 
    // pipe envia el stream a lo que especifiquemos dentro
    stream.pipe(res)
}




module.exports = {uploadFile,downloadFile}


// Streams: Manuel Alexander
