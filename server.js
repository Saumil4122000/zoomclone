const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");
const server = require("http").Server(app);
const io = require("socket.io")(server);
const {ExpressPeerServer}=require("peer");
const peerServer=ExpressPeerServer(server,{
    debug:true
});


app.set('view engine', 'ejs')
app.use(express.static('public'));
app.use('/peerjs',peerServer)




app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`)
    // It means it automatically generate uuid when you goto localhost:3030 and redirect it to sprecific room

})


app.get('/:room', (req, res) => {
    // res.render('room.ejs'); 
    // rendering the content from room.ejs
    res.render('room', { roomId: req.params.room });
})


// It accept the emited event
// get roomId from the sript.js
io.on('connection', socket => {
   socket.on('join-room',(roomId,userId)=>{
        socket.join(roomId);
        socket.to(roomId).emit('user-connected',userId);
        socket.on('message',message=>{
            io.to(roomId).emit('createMessage',message);
        })
        // It will emit to all  members of channel that user with 'userId' is connected  to our roomId
   })
})

server.listen(3030);