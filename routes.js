const { Router } = require("express");
const Zap = require('./Controllers/pes_satisfacao');
const con_api = require('./config/conexao_api');
const dataHora = require('./config/dataHora');

const routes = new Router();

//Middlewares
function validarLogin(req, res, next){
    console.log(dataHora(),"Validando Login");
    const usuario = req.body.usuario;
    const senha = req.body.senha;
    const sql = `SELECT usuario , senha FROM usuarios  WHERE usuario = '${usuario}' AND senha = '${senha}';`

    con_api.query(sql, function (err, result, fields) {
        if (err){
            console.log(dataHora(),"Erro ao bucar no BD");
            return res.status(200).json({
                error: true,
                code: 404,
                msg: "Erro ao Buscar no Banco de Dados",
                err: err
            });
        }else{
            const resposta = JSON.parse(JSON.stringify(result));
            //console.log(dataHora(),resposta.length);
            if(resposta.length === 0){
                console.log(dataHora(),"Login Invalido");
                return res.status(200).json({
                    error: true,
                    code: 401,
                    msg: "Usuário ou senha inválidos"
                });
            }else if(resposta.length === 1){
                console.log(dataHora(),"Login OK");
                next();
            }

        }
    });

}

//Pesquisa
routes.post('/enviar', validarLogin, Zap.enviarMsg);
routes.post('/online', validarLogin, Zap.online);
routes.post('/existe', validarLogin, Zap.existe);
routes.post('/link',   validarLogin, Zap.link);
routes.post('/local',  validarLogin, Zap.localizacao);

//FrontEnd Perguntas
routes.post('/cadastrar_pergunta', validarLogin, Zap.cadastrar_pergunta);
routes.post('/listar_perguntas',   validarLogin, Zap.listar_perguntas);
routes.post('/deletar_pergunta',   validarLogin, Zap.deletar_pergunta);
routes.post('/editar_pergunta',    validarLogin, Zap.editar_pergunta);

//Logar na Página
routes.post('/login',  Zap.login);

//Pesquisas enviadas
routes.post('/listar_pesquisas', validarLogin, Zap.listar_pesquisas);
routes.post('/cadastrar_pesquisas', validarLogin, Zap.cadastrar_pesquisas);
routes.post('/pegar_perfis', validarLogin, Zap.pegar_perfis);
routes.post('/todos_perfis', validarLogin, Zap.todos_perfis);
routes.post('/perfis_selecionados', validarLogin, Zap.perfis_selecionados);

//Clientes
routes.post('/cadastrar_cliente',  validarLogin, Zap.cadastrar_cliente);
routes.post('/editar_cliente',     validarLogin, Zap.editar_cliente);
routes.post('/deletar_cliente',    validarLogin, Zap.deletar_cliente);
routes.post('/listar_clientes',    validarLogin, Zap.listar_clientes);
routes.get('/mostrar_cliente/:id', Zap.mostrar_cliente);

module.exports = routes;