const express = require('express')
const setupDB = require('./config/database')
const router = require('./config/routes')
const cors = require('cors')

const app = express()
const port = 3030

var corsOption = {
    exposedHeaders: ['content-type', 'x-auth']
}

app.use(cors(corsOption))
app.use("/uploads", express.static("uploads"))

app.use(express.json())
app.use('/',router)

setupDB()

app.listen(port, ()=>{
    console.log('listening to the port', port)
})

