const express = require('express');
// const multer = require('multer');
const { MongoClient, ObjectId } = require('mongodb');

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);
const router = express.Router();

// Configurar o armazenamento para o multer
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // Diretório onde os uploads serão armazenados
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
//   },
// });

// const upload = multer({ storage: storage });

// Rota para adicionar um documento com uma ilustração
// router.post('/add', upload.single('illustration'), async (req, res) => {
router.post('/add', async (req, res) => {
  const doc = {
    name: req.body.name,
    age: req.body.age,
    history: req.body.history
    // illustration: req.file.filename, // O nome do arquivo no servidor
  };

  if (doc.name && doc.age && doc.history) {
    try {
      await client.connect();
      const db = client.db('fatecdb');
      const collection = db.collection('project-g');
      const result = await collection.insertOne(doc);
      if (result) {
        // Retorne a URL da imagem, se necessário
        // const imageUrl = `/uploads/${req.file.filename}`;
        // res.status(200).json({ message: 'Doc inserido com sucesso!', imageUrl });
        res.status(200).json({ message: 'Doc inserido com sucesso!' });
      } else {
        res.status(500).json({ message: 'Erro ao incluir o documento. Tente novamente' });
      }
    } catch (erro) {
      console.log(erro);
      res.status(500).json({ message: 'Ocorreu um erro ao incluir o DOC. Tente novamente mais tarde!' });
    } finally {
      await client.close();
    }
  } else {
    res.status(400).json({ message: 'Requisição inválida. Verifique os dados e tente novamente' });
  }
});


router.get('/list', async(req,res) => {
    try{
        await client.connect();
        const db = client.db('fatecdb');
        const collection = db.collection('project-g');
        const result = await collection.find({}).toArray();
        res.status(200).json(result);//{}
      }catch(erro){
        console.log(erro);
        res.status(500).json({message: 'Ocorreu um erro ao atender a solicitação. Tente novamente mais tarde!'});
      }finally{
        await client.close();
      }
});

router.put('/edit/:id', async(req,res) => {
    let id = req.params.id;
    let updateChar = req.body;

    try{
        await client.connect();
        const db = client.db('fatecdb');
        const collection = db.collection('project-g');

        const result = await collection.updateOne({'_id' : new ObjectId(id)}, {$set: updateChar});

        if(result){
            res.status(200).json({message: 'character atualizado com sucesso!!'});
        }else{
            res.status(400).json({message: 'Erro na alteração. Verifique se os dados estão preenchidos corretamente e tente novamente.'});
        }
    }catch(erro){
        res.status(500).json({message: 'Poxa, ocorreu um erro na alteração dos dados. Por favor tente novamente mais tarde'});
    }finally{
        await client.close();
    }
});

router.delete('/deletar/:id', async(req,res) => {
    const id = req.params.id;

    try{
        await client.connect();
        const db = client.db('fatecdb');
        const collection = db.collection('project-g');

        const result = await collection.deleteOne({'_id' : new ObjectId(id)});

        if(result.deletedCount > 0){
            res.status(200).json({message: 'Doc excluido com sucesso!'});
        }else{
            res.status(400).json({message: 'Erro ao excluir doc, verifique se selecionou um doc seu'});
        }

    }catch(erro){
        res.status(500).json({message : 'Erro na exclusão. Tente novamente mais tarde!'});
    }finally{
        await client.close();
    }
});


module.exports = router;
