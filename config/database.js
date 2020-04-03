const mongoose = require('mongoose')

const setupDB = () =>{
    mongoose
        .connect('mongodb+srv://kamydur:secret123@cluster0-d8yii.mongodb.net/test?retryWrites=true&w=majority',  { useUnifiedTopology: true, useNewUrlParser: true })
        .then(()=>{
            console.log('connected to DB')
        })
        .catch(err=>{
            console.log(err)
        })
} 

module.exports = setupDB