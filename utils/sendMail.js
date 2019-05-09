const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2

module.exports=async (toEmail,token)=>{
    const oauth2Client = new OAuth2(
        process.env.MAIL_CLIENT_ID,
        process.env.MAIL_CLIENT_SECRET,
        'https://developers.google.com/oauthplayground' // Redirect URL
    )
    
    oauth2Client.setCredentials({
        refresh_token: process.env.MAIL_REFRESH_TOKEN
    })
    const tokens = await oauth2Client.refreshAccessToken()
    const accessToken = tokens.credentials.access_token
    
    const smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.MAIL_USER,
            clientId:
                process.env.MAIL_CLIENT_ID,
            clientSecret: process.env.MAIL_CLIENT_SECRET,
            refreshToken: process.env.MAIL_REFRESH_TOKEN,
            accessToken: accessToken,
        },
    })
    
    const mailOptions = {
        from: process.env.MAIL_USER,
        to: `${toEmail}`,
        subject: 'Young Inventory App Invitation',
        generateTextFromHTML: true,
        html: `<b>Download the app and open the link inside it com.young://${token}</b>`,
    }
    
    smtpTransport.sendMail(mailOptions, (error, response) => {
        error ? console.log('errored while sending email>>>>>>>>>',error) : console.log('mail sent with response>>>>>>>>>>>>>>',response)
        smtpTransport.close()
    })
}
