const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
       type: String,
       minlength:4
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        min: 5
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    gender: {
        type: String,
        enum: ["male", "female"]
    },
    profile_img: {
        type: String
    },
    phone: {
        type: String
    },
    category: {
        type: String
    },
    created_groups: [{type: Schema.Types.ObjectId}],
    member_group: {
        type: Schema.Types.ObjectId
    },
    attended_events: {
        type: Schema.Types.ObjectId
    },
    registered_events: [{
        type: Schema.Types.ObjectId
    }],
    tokens: [
        {
            token: {
                type: String
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
})

//custom method for finding the token

userSchema.statics.findByToken = function(token) {
    const User = this
    let tokenData;
    try {
        tokenData = jwt.verify(token, 'secret123')
    } catch (error) {
        return Promise.reject(error)
    }
    return User.findOne({_id: tokenData._id, "tokens.token": token})
}

//custom static method for comparing the password
userSchema.statics.findByCredentials = function(email, password){
    const User = this
    return User.findOne({email})
        .then(function(user){
            if(!user){
                Promise.reject('ivalid email')
            }
            return bcrypt.compare(password, user.password).then((result)=>{
                if(result){
                    return Promise.resolve(user)
                } else {
                    return Promise.reject('invalid password')
                }
            })
        })
        .catch(err=>{
            return Promise.reject(err)
        })
}

//generate the random jwt token
userSchema.methods.generateToken = function() {
    const user = this
    const tokenData = {
        _id: user._id,
        email: user.email,
        createdAt: Number(new Date())
    }
    console.log(tokenData, "tokendata")
    const token = jwt.sign(tokenData, 'secret123')
    console.log("user token push ", token)
    user.tokens.push({
        token
    })
    console.log("user token after the push ", user)
    return user
        .save()
        .then(function(user){
            console.log(user, "user data after save")
            return Promise.resolve(token)
        })
        .catch(err=>{
            return Promise.reject(err)
        })
}

//encrypting the password
userSchema.pre("save", function(next){
    const user = this
    if(user.isNew){
        bcrypt.genSalt(10).then(function(salt){
            bcrypt.hash(user.password, salt).then(hashedPassword=>{
                user.password = hashedPassword
                next()
            })
        })
    } else {
        next()
    }
})

const User = mongoose.model("User", userSchema)
module.exports = User