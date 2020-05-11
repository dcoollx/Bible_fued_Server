const Router = require('express').Router;
const hri = require('human-readable-ids').hri;

Router().get('/',(req,res)=>{

  let roomCode = hri.random();

  req.app.get('io')
});