import  UserController from './UserController'
import { NextFunction, Request, Response } from 'express';
import { User } from '../entity/User'
import { hashPsw, sendMail, verify, sendNewPassword } from '../helpers'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import  '../middlewares/passport'

export default class AuthController {

    static async signup(Request, Response) {
        console.log('ee')
        const {nickname, email, password} = Request.body
                
        // Si on recupere les champs 
        if (typeof (nickname && email && password) == 'string' ) {

            // On regarde en base si l'email est déjà existant
            const find = await User.findOne({email: email}) 
            
            // Si l'email correspond en base de donnée
            if (typeof find !== 'undefined') 
                return Response.status(400).send('Un compte existe déjà avec cet email')

            const newUser: User = new User()

            // on hash le password
            const hash = await hashPsw(password)
                 
            newUser.email = email
            newUser.nickname = nickname
            newUser.password = hash
            try {
                await newUser.save()           
                const send = sendMail(email)
                
                if (send) {
                    return Response.status(200).send(`Compte crée avec success, vous avez reçu mail sur ${email}`)
                } 
            } catch (error) {
                console.log(error) 
            }
        } else {
            return Response.status(400).send(`Des champs sont manquants `)
        }
    }


    static async login(Request: Request, Response: Response, next: NextFunction) {
        const { email, password } = Request.body


        if (!email || !password) 
            return Response.status(400).send('Champs manquant, il est necessaire de donner l\'email & le mot de passe');

        const user = await User.findOne({email: email})


        passport.authenticate('local', {session: false}, (error, user) => {
            if(error || !user)
            Response.status(400).send(error)
            
            const { uuid, nickname, email, password } = user

            const token = jwt.sign(
                { uuid, nickname, email },
                process.env.JWT_SECRET
            )
            Response.json({ token })
        })(Request, Response, next)
    }



    static async forgotPassword(req, res) {
        const { email } = req.body;

        if (typeof email !== 'string')
            res.status(400).send("Enter a valid email adress")

        const user = await User.findOne({email: email})
        
        if(!user)
            res.status(400).send("You don't have an account")
        
        const send = sendNewPassword(email)

        try{
            if (send) {
                return res.status(200).send(`Un mail vous a été envoyé pour changer le mot de passe à ${email}`);
            }
        }
        catch (error) {
            console.log(error);
            }
        }
        

   /*  static resetPassword(req, res) {

    } */
}