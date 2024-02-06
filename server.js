const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

let usuariosCadastrados = [];
const jwtSecret = 'seu_segredo_secreto';

const generateToken = (usuario) => {
  const token = jwt.sign({ usuario, exp: Math.floor(Date.now() / 1000) + 60 }, jwtSecret); // Token expira em 1 minuto
  return token;
};

// Rota de login
app.post('/api/login', (req, res) => {
  try {
    const { email, senha } = req.body;

    // Simulação de autenticação (substitua por lógica de autenticação real)
    const usuarioAutenticado = usuariosCadastrados.find(
      (user) => user.email === email && user.senha === senha
    );

    if (!usuarioAutenticado) {
      return res.status(400).json({ error: 'Credenciais inválidas.' });
    }

    // Gera um token JWT e o retorna
    const token = generateToken(usuarioAutenticado);
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

app.post('/api/cadastro', (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Todos os campos devem ser preenchidos.' });
    }

    const usuarioExistente = usuariosCadastrados.find((user) => user.email === email);
    if (usuarioExistente) {
      return res.status(400).json({ error: 'Email já cadastrado.' });
    }

    const nomeExistente = usuariosCadastrados.find((user) => user.nome === nome);
    if (nomeExistente) {
      return res.status(400).json({ error: 'Nome já cadastrado.' });
    }

    const novoUsuario = { nome, email, senha };
    usuariosCadastrados.push(novoUsuario);

    const token = generateToken(novoUsuario);

    res.status(200).json({ message: 'Cadastro realizado com sucesso!', usuario: novoUsuario, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

app.get('/api/listar-usuarios', (req, res) => {
  try {
    res.status(200).json({ usuarios: usuariosCadastrados });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
