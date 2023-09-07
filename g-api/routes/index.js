const { MongoClient } = require('mongodb');
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

var express = require('express');
var router = express.Router();


// Rota de listagem geral 

router.get('/', async (req,res) => {
  try{
    await client.connect();
    const db = client.db('fatecdb');
    const collection = db.collection('project-g');
    const result = await collection.find({}).toArray();
    res.status(200).json(result);//{}
  }catch(erro){
    console.log(erro);
    res.status(500).json({ message : 'Ocorreu erro na conexão. Tente novamente mais tarde!'});
  }finally{
    await client.close();
  };
});

// Rota para adicionar doc

router.post('/add', async(req,res) => {
    const doc = {
        name : req.body.name,
        age : req.body.age,
        history : req.body.history,
        illustration : req.body.illustration // Trocar posteriormente para metodo de upload de img
    }
});

module.exports = router;
