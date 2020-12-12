import passport from 'passport'
import { User } from '../entity/User';
import { hashPsw, sendMail, verify } from '../helpers';
import { Strategy as LocalStrategy} from 'passport-local'
import { ExtractJwt, Strategy as JsonWebTokenStrategy } from 'passport-jwt';

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password"
        },
        async(email, password, done) => {
            if (typeof email !== 'string' && typeof password !== 'string') 
                return done('Champs manquant, il est necessaire de donner l\'email & le mot de passe', null)

            const user = await User.findOne({email: email})
            
            if(!user)
                return done('Wrong Credentials', null);

            if (typeof user !== 'undefined' && user.email == email ) {
                if (!await verify(password, user.password)) 
                    return done('Mauvais mot de passe', null);
            }

            return done(null, user)
        }
    )
)

passport.use(
    new JsonWebTokenStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (
        user: { email: string },
        done,
      ) => {
        const email = user.email
        const account = await User.findOne({email})
        
        if(!account)
          return done('User not found',  null)

        
          if (user.email !== account.email) {
        console.log("a")
          done('Wrong API Token', null)
        } else {

          console.log("a")

          done(null, user)
        }
      }
    )
  )