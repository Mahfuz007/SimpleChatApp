const express = require('express');
const http = require('http');
const socket = require('socket.io');
const Filter =  require('bad-words');
const {generateMessage,generateLocation} = require('./utils/messages');
const {addUser,removeUser,getUser,getUsersInRoom} = require('./utils/users');


const app = express();
const server = http.createServer(app);
const io = socket(server);

const port = process.env.PORT | 3000;

app.use(express.static('public'));

io.on('connection',(socket)=>{
    console.log('New Connection Created');
    
    socket.on('join',({username,room},callback)=>{

        let {error,user} = addUser({id: socket.id,username, room});

        if(error){
            return callback(error);
        }

        socket.join(user.room);
        socket.emit('message',generateMessage('Welcome'),'Admin');
        socket.broadcast.to(user.room).emit('message',generateMessage(`${user.username} has joined!`),'Admin');    
        callback();
        io.to(user.room).emit('roomData',getUsersInRoom(user.room),user.room);
    })

    socket.on('newMessage',(msg,callback)=>{
        let filter = new Filter();

        if(filter.isProfane(msg)){
            return callback('Profanity is not allowed');
        }

        let user = getUser(socket.id);
        io.to(user.room).emit('message',generateMessage(msg),user.username);
        callback();
    })

    socket.on('disconnect',()=>{
        let user = removeUser(socket.id);
        if(user){
            io.to(user.room).emit('message',generateMessage(`${user.username} has left`),'Admin');
            io.to(user.room).emit('roomData',getUsersInRoom(user.room),user.room);
        }
    })

    socket.on('locationData',(data,callback)=>{
        let user = getUser(socket.id);
        io.to(user.room).emit('location',generateLocation("https://google.com/maps?q="+data.latitude+","+data.longitude),user);
        callback();
    })
})

server.listen(port,()=>{
    console.log("Server running on "+port);
})