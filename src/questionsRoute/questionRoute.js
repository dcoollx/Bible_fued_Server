const express = require('express');
const Router = express.Router();
const parser = express.json();
const dbService = require('../services/dbServices');

Router.get('/',parser, (req, res, next)=>{
  dbService.getQuestion(req.app.get('db')).then(result=>{
    console.log(result);
    result.forEach(q=>{
      q.answers = [q.a,q.incorrect_1,q.incorrect_2,q.incorrect_3];
    });
    return res.json({questions:result});
  });

});

module.exports = Router;