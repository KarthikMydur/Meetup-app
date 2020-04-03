const User = require('../models/user')

const authenticateUser = (req, res, next) => {
    const token = req.header("auth-token")
    User.findByToken(token)
        .then(user=>{
            if(user){
                console.log("user details", user)
                req.user = user
                req.token = token
                next()
            } else {
                res.status("401").send('token is not available')
            }
        })
        .catch((err=>{
            res.status('401').send(err)
        }))
}

module.exports = authenticateUser