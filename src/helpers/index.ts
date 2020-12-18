import * as bcryptjs from 'bcryptjs';
import * as nodemailer from 'nodemailer';

const env = require('dotenv').config();


async function hashPsw(password: string) {
    return bcryptjs.hashSync(password, env.HASH_SECRET);
}

async function verify(password: string, bdpsw: string) {
    return bcryptjs.compareSync(password, bdpsw);
}

async function sendMail(userMail: string) {
    let testAccount = await nodemailer.createTestAccount();

    let transport = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: "stella0@ethereal.email",
            pass: "bUqB4VDFSHpJKHgnP5",
        }
    });

    const msg = {
        from: 'myS3@mail.com',
        to: userMail,
        subject: 'BIENVENUE DANS LA FAMILY',
        html: '<h1>Bienvenue, vous etes officieusement de la famille</h1>'

    }

    transport.sendMail(msg, (err, info) => {
        if (err) {
            console.log('erreur => ', err);
        } else {
            // console.log('INFO', info);
        console.log("Message sent: %s", info);

        }
    })
}

async function sendNewPassword(userMail: string, token: string) {
   // let testAccount = await nodemailer.createTestAccount();
   let testAccount = await nodemailer.createTestAccount();

   let transport = nodemailer.createTransport({
       host: "smtp.ethereal.email",
       port: 587,
       secure: false,
       auth: {
           user: "stella0@ethereal.email",
           pass: "bUqB4VDFSHpJKHgnP5",
       }
   });

   const msg = {
       from: 'myS3@mail.com',
       to: userMail,
       subject: 'BIENVENUE DANS LA FAMILY',
       html: `<h1>Bienvenue, vous etes officieusement de la famille, clickez sur ce lien pour rese</h1>
        <p> ${process.env.HOST_URL}/auth/activate/${token} </p>`

   }

   transport.sendMail(msg, (err, info) => {
       if (err) {
           console.log('erreur => ', err);
       } else {
           // console.log('INFO', info);
       console.log("Message sent: %s", info);

       }
   })
}

async function sendNewPasswordSaved(userMail: string) {
    // let testAccount = await nodemailer.createTestAccount();
    let testAccount = await nodemailer.createTestAccount();
    console.log(testAccount)
 
    let transport = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: "stella0@ethereal.email",
            pass: "bUqB4VDFSHpJKHgnP5",
        }
    });
 
    const msg = {
        from: 'myS3@mail.com',
        to: userMail,
        subject: 'BIENVENUE DANS LA FAMILY',
        html: `<h1>Your new password has been saved succesfully </h1>`
 
    }
 
    transport.sendMail(msg, (err, info) => {
        if (err) {
            console.log('erreur => ', err);
        } else {
            // console.log('INFO', info);
        console.log("Message sent: %s", info);
 
        }
    })
 }

export  {
    hashPsw,
    verify,
    sendMail,
    sendNewPassword,
    sendNewPasswordSaved
}