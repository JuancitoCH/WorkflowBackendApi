require('dotenv').config()

const configVars ={
    port:process.env.PORT,
    db_userName: process.env.DB_USERNAME,
    db_password: process.env.DB_PASSWORD,
    db_name: process.env.DB_NAME,
    db_host: process.env.DB_HOST,
    jwt_secret: process.env.JWT_SECRET,

    oauth_client_id:process.env.OAUTH_CLIENT_ID,
    oauth_client_secret:process.env.OAUTH_CLIENT_SECRET,
    oauth_callback_url:process.env.NODE_ENV==='dev'?process.env.OAUTH_CALLBACK_URL : process.env.OAUTH_CALLBACK_URL_PRODUCTION, 
    
    email_host:process.env.EMAIL_HOST,
    email_port:process.env.EMAIL_PORT,
    email_secure:process.env.EMAIL_SECURE,
    email_user:process.env.EMAIL_USER,
    email_password:process.env.EMAIL_PASSWORD,

    // ROLES APP USE
    normalRol:process.env.ROLNORMAL,
    editorRol:process.env.ROLEDITOR,
    validatorRol:process.env.ROLVALIDATOR,
    leaderRol:process.env.ROLLEADER

}
module.exports = configVars