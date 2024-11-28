var express = require('express');
var router = express.Router();
const pool = require('../db/db.js');
const { format } = require('date-fns');
const verificaAutenticacao = require('../public/functions/midleware.js');

// Renderiza a página de cadastro de IP
router.get('/', verificaAutenticacao, (req, res) => {
  res.render('cadastroIP', { error: null }); // Inicializa sem mensagem de erro
});

// Rota para o envio de dados para o cadastro de IP
router.post('/addIP', verificaAutenticacao, async (req, res) => {
  const { utilizador, matricula, ip } = req.body;
  const dataAtual = format(new Date(), 'yyyy/MM/dd');

  try {
    // Valida se todos os campos foram preenchidos
    if (!utilizador || !matricula || !ip) {
      return res.render('cadastroIP', { error: 'Todos os campos são obrigatórios.' });
    }

    // Verifica se o IP já está cadastrado
    const existingIP = await pool.query("SELECT * FROM endereco_ip WHERE ip = $1", [ip]);
    if (existingIP.rowCount > 0) {
      return res.render('cadastroIP', { error: 'IP já existente.' });
    }

    console.log(req.session.usuarioLogado);
    let getId_usuario = await pool.query('SELECT * FROM usuario WHERE email = $1', [req.session.usuarioLogado.nome]);
    console.log(getId_usuario.rows[0]);
    let id_usuario = getId_usuario.rows[0].id_usuario

    // Insere o novo IP no banco
    await pool.query(
      "INSERT INTO endereco_ip(utilizador, matricula_utilizador, ip, data_registro, id_usuario_cadastro) VALUES ($1, $2, $3, $4, $5)", 
      [utilizador, matricula, ip, dataAtual, id_usuario]
    );

    console.log('IP registrado com sucesso:', ip);
    res.redirect('/lista'); // Redireciona após o sucesso
  } catch (error) {
    console.error("Erro ao cadastrar IP:", error);
    res.render('cadastroIP', { error: 'Erro ao cadastrar o IP. Tente novamente.' });
  }
});

// Rota para autenticação
router.post('/autentication', async (req, res) => {
  const { utilizador, matricula, ip } = req.body;

  try {
    // Valida os campos obrigatórios
    if (!utilizador || !matricula || !ip) {
      return res.render('cadastroIP', { error: 'Todos os campos são obrigatórios.' });
    }

    // Simula lógica de autenticação (adicione lógica de autenticação real aqui)
    console.log('Usuário autenticado:', { utilizador, matricula, ip });
    res.redirect('/success');
  } catch (error) {
    console.error("Erro na autenticação:", error);
    res.render('cadastroIP', { error: 'Erro na autenticação. Tente novamente.' });
  }
});

// Rota para logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Erro ao fazer logout');
    }
    res.redirect('/login');
  });
});

module.exports = router;
