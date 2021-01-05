import { Any, getRepository } from 'typeorm'
import { NextFunction, Request, Response } from "express";
import { User} from '../entity/User'
import { hashPsw, sendMail } from "../helpers"
import bcrypt from 'bcryptjs';

export default class UserController {

    static async findOne(request: Request, response: Response, next: NextFunction){
        const user = await User.findOne(request.params.id)
        if (typeof user == 'undefined')
            return response.status(400).send('Utilisateur introuvable')
        return response.status(200).send(user)
    }

    static async findAll(request: Request, response: Response, next: NextFunction){
        const users = await User.find()
        return response.status(200).send(users)
    }

    static async save( request: Request, response: Response, next: NextFunction ) {
        const { nickname, email, password } = request.body

        if(typeof (nickname && email && password ) == 'string'){
            
            const find = await User.findOne({email: email})

            if (typeof find !== 'undefined')
                return response.status(400).send('Ce compte existe déjà')

            const newUser = new User()
            
            const hash = await hashPsw(password);

            newUser.email = email
            newUser.nickname = nickname
            newUser.password = hash

            try {
                await newUser.save()           
                const send = sendMail(email);
                
                if (send) {
                    return response.status(200).send(`Compte crée avec success, vous avez reçu mail sur ${email}`);
                } 
            } catch (error) {
                console.log(`${error} hehe`);   
            }
        } else {
            return response.status(400).send(`Des champs sont manquants `);
        }

    }

    static async remove(request: Request, response: Response, next: NextFunction) {
        
        const userRepository = getRepository(User);
        const user = await userRepository.findOne(request.params.uuid)

        if (typeof user == 'undefined') 
            return response.status(400).send('Aucun compte sous cette ID');
        
        const remove = await userRepository.remove(user);
        return response.status(200).send(remove);
    }

    static async removeAll(request: Request, response: Response, next: NextFunction) {
        
        const users = await User.find()
        const userRepository = getRepository(User);
    
        const remove = await userRepository.remove(users);
        return response.status(200).send(remove);
    }

    static async update(request: Request, response: Response, next: NextFunction) {
        const userRepository = getRepository(User);
        let user = await userRepository.findOne(request.params.uuid)

        if (typeof user == 'undefined') 
            return response.status(400).send('Aucun compte sous cette ID');
        
        const { nickname, password, email } = request.body;

        
        const mailUpdt = user.email !== email ? email : user.email;
        const nickUpdt = user.nickname !== nickname ? nickname : user.nickname;
        const pswdUpdt = user.password !== password && typeof password == 'string' ? await hashPsw(password) : password;
       
        user.nickname = nickUpdt;
        user.email = mailUpdt;
        user.password = pswdUpdt;
        
        const update = await userRepository.save(user);
        return response.status(200).send(update)
    }

}