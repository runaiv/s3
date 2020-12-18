import passport, { use } from 'passport'

function checkJwt() {
  return (request, response, next) => {
    //console.log(request.headers['authorization'])
    passport.authenticate('jwt', (error, user) => {
      if (error || !user) {
        return response
          .status(401)
          .json({ error })
      }
      next()
    })(request, response, next)
  }
}

export default checkJwt