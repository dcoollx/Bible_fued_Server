/* eslint-disable no-console */
const dbService = require('./services/dbServices');
const hri = require('human-readable-ids').hri;
const app = require('./app').app;
const server = require('./app').server;
const {PORT, DATABASE_URL} = require('./config');
const io = require('socket.io')(server);
//database
const knex = require('knex');

const db = knex({
  client : 'pg',
  connection : process.env.DATABASE_URL
});
console.log(process.env.DATABASE_URL);
var openGames = {};
let games = io.of('/games');
games.on('connection', (soc)=>{
  console.log('someone connects');
  soc.on('create',()=>{
    console.log('new room created');
    //gen rendaom room key
    let key = hri.random();
    openGames[key] = {id:soc.id, players : [],questions : []};

    soc.emit('newRoom',{roomCode :key});
  });
  soc.on('join',(data)=>{
    //first check it successfull
    let key = data.roomCode;
    if(openGames[key]){
      soc.join(data.roomCode);
      openGames[key].players.push({name:data.name, score:0});
      io.of('games').to(key).emit('joined',openGames[key].players);
      console.log(`${data.name} joined ${data.roomCode} room`);
    }else{
      soc.emit('Server_error',{error:'that game doesnt exist'});
      console.log('that game doent exsist');
    }
    
    //console.log(data);
  });
  soc.on('startGame',()=>{
    let key = Object.keys(soc.rooms)[1];
    console.log('starting room' + key);
    //TODO check if enough players
    //get questions
    openGames[key].questions = dbService.getQuestion(db);
    //openGames[key].start = Date.now();
    io.of('games').to(key).emit('start',{start : Date.now()});
    //io.of('myNamespace').to('room').emit('event', 'message');
  });
  soc.on('answer',(data)=>{
    //should have name and choice
    console.log(' answered' + data);
  });
  soc.on('question',(question)=>{
    //console.log(soc.rooms, 'asked',question.length, 'questions');
    soc.to(Object.keys(soc.rooms)[1]).emit('questions',question);
  });
  soc.on('round',()=>{
    let key = Object.keys(soc.rooms)[1];
    soc.to(key).emit('round');

  });
  soc.on('leave',(isHost)=>{
    let key = Object.keys(soc.rooms)[1];
    if(isHost){
      io.of('games').to(key).emit('cancel');
      console.log('host has left, closing room');
    }
    else{
      console.log('player left ' + key);
      //TODO remove from player list
    }
  });
});
games.on('disconnect',(soc)=>{
  console.log('player disconnected');
});


//app.set('db',db);
app.set('io',io);
app.set('db',db);


server.listen(PORT,()=>{
  console.log(`Server is listening on port ${PORT}`);
});

