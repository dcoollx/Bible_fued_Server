/* eslint-disable no-console */
const hri = require('human-readable-ids').hri;
const app = require('./app').app;
const server = require('./app').server;
const {PORT} = require('./config');
const io = require('socket.io')(server);
//database
//const knex = require('knex');

//let db = knex({});
var openGames = {};
let games = io.of('/games');
games.on('connection', (soc)=>{
  console.log('someone connects');
  soc.on('create',()=>{
    console.log('new room created');
    //gen rendaom room key
    let key = hri.random();
    openGames[key] = soc.id;

    soc.emit('newRoom',{roomCode :key});
  });
  soc.on('join',(data)=>{
    //first check it successfull
    let key = data.roomCode;
    if(openGames[key]){
      soc.join(data.roomCode);
      soc.to(key).emit('joined',{name:'player_name'});
      console.log(`player joined ${data.roomCode} room`);
    }else{
      console.log('that game doent exsist');
    }
    
    //console.log(data);
  });
  soc.on('start',()=>{
    let key = Object.keys(soc.rooms)[1];
    console.log('starting');
    console.log('this is sent to :',Object.keys(soc.rooms)[1]);
    io.of('games').to(key).emit('start');
    //io.of('myNamespace').to('room').emit('event', 'message');
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

