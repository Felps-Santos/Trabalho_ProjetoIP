var express = require('express');
var router = express.Router();
const pool = require('../db/db.js')

/* Renderiza a página de login */
router.get('/', function(req, res, next) {
  res.render('TelaDeCadastro');
});

router.post('/addClient', async (req, res, next) => {
  const { matricula, nome, email, senha } = req.body
  try{
    console.log({matricula, nome, email, senha});
    const result = await pool.query(
      "INSERT INTO usuario(matricula, nome, email, senha) VALUES ($1, $2, $3, $4)", [matricula, nome, email, senha]
    );
    res.redirect("/sucesso");
  } catch(error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/sucesso', function(req, res, next) {
  res.render('SucessoCadastro');
});

module.exports = router;
