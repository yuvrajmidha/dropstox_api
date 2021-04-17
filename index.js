const http  = require('http')

//port Number
const app = require('./app')
const port = process.env.PORT

//creating the server
const server  = http.createServer(app)

server.listen(port , () =>{
    console.log(`Server is listening on Port ${port}`)
})