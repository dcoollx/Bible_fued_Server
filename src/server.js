/* eslint-disable no-console */
const hri = require('human-readable-ids').hri;
const app = require('./app').app;
const server = require('./app').server;
const {PORT} = require('./config');
const io = require('socket.io')(server);
//database
//const knex = require('knex');

//let db = knex({});

let games = io.of('/games');
games.on('connection', (soc)=>{
  console.log('someone connects');
  soc.on('create',()=>{
    console.log('new room created');
    //gen rendaom room key

    soc.emit('newRoom',{roomCode : hri.random()});
  });
  soc.on('join',(data)=>{
    soc.join(data.roomCode);
    console.log(`player joined ${data.roomCode} room`);
    //console.log(data);
  });
});
games.on('disconnect',(soc)=>{
  console.log('player disconnected');
});


//app.set('db',db);
app.set('io',io);


server.listen(PORT,()=>{
  console.log(`Server is listening on port ${PORT}`);
});

