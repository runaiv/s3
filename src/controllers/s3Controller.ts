import  UserController from './UserController'
import { Any, getRepository, createConnection } from 'typeorm'
import { NextFunction, request, Request, Response } from 'express';
import { User } from '../entity/User'
import { hashPsw, sendMail, verify, sendNewPassword, sendNewPasswordSaved } from '../helpers'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import  '../middlewares/passport'
import { UpdateQueryBuilder } from 'typeorm';
import update from './UserController'
import { Bucket } from '../entity/Bucket'
import { Blob } from '../entity/Blob'
const fs = require('fs')


export default class s3Controller {

    static async createBucket(Request, Response) {
        const {uuid, bucketName} = Request.body
        
        if (typeof (bucketName) == 'string' && (uuid || bucketName) ) {
            const user = await User.findOne({uuid: uuid})
            
            if (typeof user === 'undefined') 
                return Response.status(400).send('utilisaeur n\'existe pas')
            
            const bucketRepo = await Bucket.findOne({bucketName: bucketName})
            if (typeof bucketRepo != 'undefined' && bucketRepo.bucketName == bucketName)
                return Response.status(400).send('You already have a bucket with this name')


            const bucket: Bucket = new Bucket()

            bucket.bucketName = bucketName
            bucket.user = uuid 

            try {
                await bucket.save()  
                return Response.status(200).send(`your bucket: ${bucket} is created succesfully`)
            } catch (error) {
                console.log(error) 
            }
        } else {
            return Response.status(400).send(`Error`)
        }
    }


    static async editBucket(Request: Request, Response: Response) {
        const {uuid, bucketName, newBucketName} = Request.body
        
        if ( typeof (bucketName && newBucketName) == 'string' && (uuid || bucketName || newBucketName) ) {
            const user = await User.findOne({uuid: uuid})
            
            if (typeof user === 'undefined') 
                return Response.status(400).send('utilisaeur n\'existe pas')

            const bucket = await Bucket.findOne({bucketName: bucketName})

            console.log(bucket.userId ==uuid)
                        
            if (typeof bucket === 'undefined') 
                return Response.status(400).send('invalid Bucket')

            if(bucket.userId != uuid)
                return Response.status(400).send('utilisaeur ne contient pas cette bucket')

            bucket.bucketName != newBucketName ? bucket.bucketName = newBucketName : bucket

            try {
                await bucket.save()  
                return Response.status(200).send(`your bucketname: ${bucketName} is  succesfully changed to ${newBucketName}`)
            } catch (error) {
                console.log(error) 
            }
        } else {
            return Response.status(400).send(`Error`)
        }
    }

    static async deleteBucket(Request: Request, Response: Response) {
        const {uuid, bucketName} = Request.body
        
        if ( typeof (bucketName) == 'string' && (uuid || bucketName) ) {
            const user = await User.findOne({uuid: uuid})
            
            if (typeof user === 'undefined') 
                return Response.status(400).send('utilisaeur n\'existe pas')

            const bucket = await Bucket.findOne({bucketName: bucketName})

            if (typeof bucket === 'undefined') 
                return Response.status(400).send('invalid Bucket')

            if(bucket.userId != uuid)
                return Response.status(400).send('utilisaeur ne contient pas cette bucket')

            try {
                await bucket.remove()
                return Response.status(200).send(`your bucket: ${bucketName} is deleted`)
            } catch (error) {
                console.log(error) 
            }
        } else {
            return Response.status(400).send(`Error`)
        }
    }

    static async findAllBlobs(Request: Request, Response: Response) {
        const {uuid, bucketName} = Request.body
        
        if ( typeof (bucketName) == 'string' && (uuid || bucketName) ) {
            const user = await User.findOne({uuid: uuid})
            
            if (typeof user === 'undefined') 
                return Response.status(400).send('utilisaeur n\'existe pas')

            const buckets = await Bucket.find({bucketName: bucketName})

            if (typeof buckets === 'undefined') 
                return Response.status(400).send('invalid Bucket')
            
            const blobs = []
            buckets.forEach(bucket => {
                if(bucket.userId != uuid)
                    return Response.status(400).send('utilisaeur ne contient pas cette bucket')
                
                blobs.push(bucket.blob)           
            })
            return Response.status(200).send(blobs)


        } else {
            return Response.status(400).send(`Error`)
        }
    }

    static async checkBucket(Request: Request, Response: Response) {
        const {uuid, bucketName} = Request.body
        
        if ( typeof (bucketName) == 'string' && (uuid || bucketName) ) {

            const user = await User.findOne({uuid: uuid})

            if (typeof user === 'undefined') 
                return Response.status(400).send('utilisaeur n\'existe pas')

            const bucket = await Bucket.findOne({bucketName: bucketName})

            if (typeof bucket === 'undefined') 
                return Response.status(400).send(`${bucketName} doesn't exist`)

            return Response.status(200).send(`${bucketName} exists`)

        } 
        else {
            return Response.status(400).send(`Error`)
        }
    }

    static async addBlob(req, res, next) {
        const { fieldname, path, size, originalname } = req.file
        const { uuid, bucketName } = req.params
        
        console.log('ee', originalname, path, size)

        if (typeof (originalname || path ) == 'string' && (path || size || originalname) ) {
            const user = await User.findOne({uuid: uuid})
            
            if (typeof user === 'undefined') 
                return res.status(400).send('utilisaeur n\'existe pas')
            
            const bucketRepo = await Bucket.findOne({bucketName: bucketName})
            console.log(typeof bucketRepo.id.toString(), typeof uuid)
            const bucketId : any = bucketRepo.id
        
            if (typeof bucketRepo === 'undefined' || bucketRepo.bucketName !== bucketName)
                return res.status(400).send('Error bucket')

            const blob: Blob = new Blob()

            blob.name = originalname
            blob.path = path
            blob.size = size
            blob.bucket = bucketId
            console.log(blob)

            try {
                await blob.save()  
                return res.status(200).send(`your blob: ${blob} is created succesfully`)
            } catch (error) {
                console.log(error) 
            }
        } else {
            return res.status(400).send(`Error`)
        }
    }

    static async deleteBlob(req, res, next) {
        const { uuid, bucketName } = req.params
        const { id } = req.body
        
        console.log( uuid, id)

        if (typeof (bucketName ) == 'string' && (uuid || bucketName || id) ) {
            const user = await User.findOne({uuid: uuid})
            
            if (typeof user === 'undefined') 
                return res.status(400).send('utilisaeur n\'existe pas')
            
            const bucketRepo = await Bucket.findOne({bucketName: bucketName})

            if (typeof bucketRepo === 'undefined' || bucketRepo.bucketName !== bucketName)
                return res.status(400).send('Error bucket')

           const blob = await Blob.findOne({id: id})
           if (typeof blob === 'undefined')
                return res.status(400).send('blob not found')
           console.log(blob)
           const path = `./myS3DATA/${uuid}/${bucketName}/${blob.name}`

            console.log(blob)
            try {
                fs.unlink(path, (err) => {
                    if (err)
                        console.log(err)
                    return
                })
                await blob.remove()  
                return res.status(200).send(`your blob: ${blob} is deleted succesfully`)
            } catch (error) {
                console.log(error) 
            }
        } 
        else {
            return res.status(400).send(`Error`)
        }
    }

    static async getBlob(req, res, next) {
        const { uuid, bucketName } = req.params
        const { id } = req.body
        
        console.log( uuid, id)

        if (typeof (bucketName ) == 'string' && (uuid || bucketName || id) ) {
            const user = await User.findOne({uuid: uuid})
            
            if (typeof user === 'undefined') 
                return res.status(400).send('utilisaeur n\'existe pas')
            
            const bucketRepo = await Bucket.findOne({bucketName: bucketName})

            if (typeof bucketRepo === 'undefined' || bucketRepo.bucketName !== bucketName)
                return res.status(400).send('Error bucket')

           const blob = await Blob.findOne({id: id})
           
            if (typeof blob === 'undefined')
                return res.status(400).send('blob not found')

            const path = `./myS3DATA/${uuid}/${bucketName}/${blob.name}`
    
            console.log(path)

            try {
                if (fs.existsSync(path)) {
                    console.log('ee')

                    return res.status(200).sendFile(path)
                }
                else
                    return res.Send(404).send('blob not found')
            } catch (error) {
                console.log(error) 
            }
        } 
        else {
            return res.status(400).send(`Error`)
        }
    }

}
