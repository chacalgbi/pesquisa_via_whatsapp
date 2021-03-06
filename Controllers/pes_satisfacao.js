var venom = require("venom-bot");
var request = require('request');
const dataHora = require('../config/dataHora');
const con_api = require('../config/conexao_api');
const micks = require('../config/micks');
const respostasTexto = ['ZERO',0,'Zero',0,'zero',0,'UM',1,'um',1,'Um',1,'DOIS',2,'dois',2,'Dois',2,'TRES',3,'TRÊS',3,'TREZ',3,'Tres',3,'Três',3,'Trez',3,'tres',3,'três',3,'trez',3,'QUATRO',4,'Quatro',4,'quatro',4,'CINCO',5,'Cinco',5,'cinco',5,'SEIS',6,'Seis',6,'seis',6,'SETE',7,'Sete',7,'sete',7,'OITO',8,'Oito',8,'oito',8,'NOVE',9,'Nove',9,'nove',9,'DEZ',10,'Dez',10,'Des',10,'dez',10,'1',1,'2',2,'3',3,'4',4,'5',5,'6',6,'7',7,'8',8,'9',9,'10',10];
var resp_correta = false;
var clientEnvio;
var sucesso = false;
var repetido = true;
var chatId = "";
var nota = 0;
var comentario = "Obrigado por contribuir com nossa pesquisa! Deixe um comentário sobre a nota que você atribuiu.";
var agradecimento = "A Micks agradece o seu comentário.";
var agradecimento_erro = "A Micks agradece a sua atenção.";

var detrator = `Oi cliente, agradecemos pelo seu tempo em nos responder. Gostamos de realizar essa pesquisa para acompanhar de perto a satisfação de quem confia na gente.  
Vi que deu uma nota de satisfação abaixo da média e de antemão pedimos desculpas por isso. Queremos melhorar a sua experiência com a gente. 
Já vamos verificar internamente, fazer contato para entender melhor e trabalhar em uma solução de maior satisfação.  
 
Mais uma vez, obrigado pelo seu retorno e vamos juntos atuar nesse caso! 
Um forte abraço, 
Equipe de Atenção ao Cliente Micks 
 
Micks Informa: 
Este canal é utilizado apenas para pesquisa. Para entrar em contato, utilize os canais de atendimento abaixo: 
Telefone: (77)3451-3838 
WhatsApp: (77)9 8802-3452`;

var neutro = `Oi cliente, agradecemos pelo seu tempo em nos responder. Gostamos de realizar essa pesquisa para acompanhar de perto a satisfação de quem confia na gente.  ❤️
Gostaríamos muito de saber mais como podemos fazer para melhorar o serviço que oferecemos e aumentar a sua nota. Quaisquer informações, sugestões ou críticas será muito importante para direcionar nossas ações.  
Queremos mudar sua satisfação para melhor e iremos atuar o mais breve possível. 
 
Um forte abraço, 
Equipe de Atenção ao Cliente Micks 
 
Micks Informa: 
Este canal é utilizado apenas para pesquisa. Para entrar em contato, utilize os canais de atendimento abaixo: 
Telefone: (77)3451-3838 
WhatsApp: (77)9 8802-3452`;

var promotor = `Oi cliente, agradecemos pelo seu tempo em nos responder. Gostamos de realizar essa pesquisa para acompanhar de perto a satisfação de quem confia na gente. 
Ficamos muuuuuuito felizes em receber a sua nota. E olha, vamos ficar mais felizes ainda em saber o motivo da sua satisfação conosco. É um prazer ter você como nosso cliente.❤️
Se desejar compartilhar com quem pesquisa sobre a Micks, temos uma página de avaliação no Google onde você pode dizer porque gosta e confia no nosso serviço  
Basta acessar o link abaixo e deixar seu comentário e nota por lá.  
  
https://www.google.com.br/search?client=opera&q=MICKS+TELECOM&sourceid=opera&ie=UTF-8&oe=UTF-8#lrd=0x75aea642bd4254f:0x66cd72f49ff0c415,1,,, 
 
Agradecemos sua confiança e conte conosco sempre que precisar! 
 
Um forte abraço, 
Equipe de Atenção ao Cliente Micks

Micks Informa:
Este canal é utilizado apenas para pesquisa. Para entrar em contato, utilize os canais de atendimento abaixo:
Telefone: (77)3451-3838
WhatsApp: (77)9 8802-3452`;

var msg_padrao= `Micks Informa:
Este canal é utilizado apenas para pesquisa. Para entrar em contato, utilize os canais de atendimento abaixo:
Telefone: (77)3451-3838
WhatsApp: (77)9 8802-3452`;

var pedir_numero_valido = "Por favor, digite somente um número válido de 0 a 10.";

//Formata qualquer numero de Celular para o formato (77) 91234-5678
function formatar_celular(num){
    let formatado = num.replace(/\D+/g, "");
    let final = '';
    if(formatado.length == 11){
        final = formatado.replace(/(\d{2})?(\d{5})?(\d{4})/, "($1) $2-$3");
    }else if(formatado.length == 10){
        final = formatado.replace(/(\d{2})?(\d{4})?(\d{4})/, "($1) 9$2-$3");
    }else if(formatado.length ==  9){
        final = formatado.replace(/(\d{5})?(\d{4})/, "(77) $1-$2");
    }else if(formatado.length ==  8){
        final = formatado.replace(/(\d{4})?(\d{4})/, "(77) 9$1-$2");
    }else{
        final = "erro";
    }
    return final;
}

function enviarPergunta(numero, texto){
    clientEnvio.sendText(numero, texto).then((result) => {
        //console.log(dataHora(),'MSG Enviada: ',texto);
    })
    .catch((erro)=>{
        console.log(dataHora(),`Erro: `, erro.status, " - ", erro.text);
    });
}

function enviarLocalizacao(numero, texto){
    clientEnvio.sendLocation(numero, '-14.22672', '-42.78338', texto)
    .then((result) => {
        console.log(dataHora(),'Localizacao Enviada.');
    })
    .catch((erro) => {
        console.error(dataHora(),'Erro ao enviar localizacao: ', erro);
    });
}

async function enviarLink(numero, link, descricao){
    await clientEnvio.sendLinkPreview(numero, link, descricao).then((result) => {
    console.log(dataHora(),'Link enviado');
  })
  .catch((erro) => {
    console.error(dataHora(), 'Erro ao enviar link: ', erro);
  });
}

function pegar_campanha(chatId){
    const temp = chatId.slice(2); // Tira o 55
    const cel = formatar_celular(temp);
    //console.log(dataHora(),"Celular Formatado: ", cel);
    return new Promise((resolve,reject)=>{
        const pegar = `SELECT nome, cel, perfil, campanha FROM clientes WHERE cel='${cel}';`;
        con_api.query(pegar, function (erro, result, fields){
            if (erro){
                console.log(dataHora(),erro);
                reject(erro);
            }
            else{
                const resposta = JSON.parse(JSON.stringify(result));
                //console.log(dataHora(),"resposta: ", resposta);
                resolve(resposta[0].campanha);
            }
        });
    });
}

function numeros(num){
    if (parseInt(num) >= 10){
        return "10"
    }else{
        let formatado = num.replace(/\D+/g, "");
        if(formatado.length === 2){
            if(formatado[0] === '0'){
                return formatado[1];
            }else if(formatado === '10'){
                return formatado;
            }else if (parseInt(formatado) > 10){
                return "10"
            }else{
                return "Indeterminado";
            }
        }else if(formatado.length === 1){
            return formatado;
        }else{
            return "Numero Invalido";
        }
    }
}

// Responder  Mensagem
venom.create(
    'NPS',
    undefined,
    (statusSession, session) => {
      console.log(dataHora(),'Status Session: ', statusSession);
      //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken || chatsAvailable || deviceNotConnected || serverWssNotConnected || noOpenBrowser
      //Create session wss return "serverClose" case server for close
      console.log(dataHora(),'Session name: ', session);
    },
    undefined
).then(async function (client){
    clientEnvio = client;
    client.onMessage( (message) => {
        clientEnvio = client;
        resp_correta = false;
        nota = 0;

        //console.log("TESTE:",message.body, message.chatId);

        if (message.isGroupMsg === false && message.body != undefined) {
            console.log(dataHora(),"Mensagem Recebida: ",message.body);

            const existe = `SELECT * FROM pesquisa_chat WHERE idchat = '${message.chatId}';`;
            // Verifica se o número que enviou a MSG está na lista da pesquisa
            con_api.query(existe, function (erro, result, fields){
                if (erro){ 
                    console.log(dataHora(),erro);
                    enviarPergunta(message.from, "Desculpe, não podemos te atender. Erro interno.");
                }
                else{
                     const resposta = JSON.parse(JSON.stringify(result));

                    // Número não participa da pesquisa, enviar mensagem padrão.
                    if(resposta.length === 0){ 
                        enviarPergunta(message.from, msg_padrao);
                    }
                    
                    // Número participa da pesquisa.
                    else{

                        // Tira as letras e deixa só numeros, caso o cliente envia por exemplo: "Bom dia! Nota 07"
                        let numero_extraido = numeros(message.body);

                        // Ainda não deu a nota
                        if(resposta[0].resposta == null){

                            // Verifica se a resposta é válida
                            respostasTexto.forEach((item, index)=>{ if(numero_extraido === item){ resp_correta = true; nota = respostasTexto[index+1]; } });

                            // Se for uma resposta válida
                            if(resp_correta){

                                //Pega o nome da campanha
                                pegar_campanha(message.chatId).then((res)=>{
                                    const campanha = res;
                                    const gravarResposta = `UPDATE pesquisa_chat SET resposta='${nota}', campanha='${campanha}', hora_resp=NOW() WHERE idchat='${message.chatId}';`;
                                    con_api.query(gravarResposta, function (erro1, result1, fields1){
                                        if(erro1){
                                            console.log(dataHora(),"UPDATE ERRO: ",erro1);
                                        }
                                        else{
                                            //console.log(dataHora(),"Resposta Gravada!");
    
                                            //Envia a pergunta sobre o comentario.
                                            
                                            //console.log(dataHora(),"Enviando pergunta do Comentário");
                                            con_api.query(`UPDATE pesquisa_chat SET comentario='Comentario enviado' WHERE idchat='${message.chatId}'`, function (erro3, result3, fields3){
                                                if(erro3){
                                                    console.log(dataHora(),"UPDATE ERRO: ",erro3); }
                                                else{
                                                    //console.log(dataHora(),"Pergunta do comentario enviada para pesquisa chat!");
                                                }
                                            });
                                            con_api.query(`UPDATE resultado_chat SET comentario='Comentario enviado' WHERE idchat='${message.chatId}'`, function (erro6, result6, fields6){
                                                if(erro6){
                                                    console.log(dataHora(),"UPDATE ERRO: ",erro6); }
                                                else{
                                                    enviarPergunta(message.from, comentario);
                                                    //console.log(dataHora(),"Pergunta do comentario enviada para resultado chat!");
                                                }
                                            });
    
                                        }
                                    });

                                }).catch((erro)=>{
                                    console.log("Erro ao pegar a campanha ",erro);
                                });

                            }
                            
                            // Se a resposta não for válida.
                            else{
                                console.log(dataHora(),"Resposta Invalida");

                                //Verifica se já existe uma tentativa de resposta.

                                //Se não tiver tentativas, envia de novo a pergunta.
                                if(resposta[0].tentativas == 0){
                                    con_api.query(`UPDATE pesquisa_chat SET tentativas='1' WHERE idchat='${message.chatId}'`, function (erro2, result2, fields2){
                                        if(erro2){
                                            console.log(dataHora(),"UPDATE ERRO: ",erro2); }
                                        else{
                                            //console.log(dataHora(),"Tentativa 1 Gravada!");
                                            enviarPergunta(message.from, pedir_numero_valido);
                                        }
                                    });
                                }
                                else{
                                    // Se já respondeu errado uma vez, agradece e finaliza o chat.
                                    if(resposta[0].tentativas == 1){
                                        console.log(dataHora(),"Segunda resposta errada deste cliente");
                                        let celular1 = formatar_celular(resposta[0].cel);
                                        con_api.query(`INSERT INTO nao_respondeu (nome, cel, msg) values ("${resposta[0].nome}", "${celular1}", "${message.body}");`, function (er, certo, linhas){ 
                                            if(er){
                                                console.log(er);
                                            }else{
                                                //console.log("Cliente Inserido na tabela nao_respondeu.");
                                            }
                                            con_api.query(`DELETE FROM pesquisa_chat WHERE idchat='${message.chatId}'`, function (erro5, result5, fields5){
                                                if(erro5){
                                                    console.log(dataHora(),"UPDATE ERRO: ",erro5); }
                                                else{
                                                    //console.log(dataHora(),"Tentativa 2 Gravada!");
                                                    enviarPergunta(message.from, agradecimento_erro);
                                                }
                                            });
                                        });  
                                    }
                                    else{
                                        // Se o cliente ficar enviando mais coisas, não faz nada.
                                    }
                                }
                            }

                        }
                        // Já deu a nota
                        else{
                            //Se o campo comentário NÃO estiver vazio.
                            if(resposta[0].comentario != null){
                                // Se a resposta do comentário estiver vazia: GRAVA
                                if(resposta[0].comen_resp == null){
                                    con_api.query(`DELETE FROM pesquisa_chat WHERE idchat='${message.chatId}'`, function (erro4, result4, fields4){
                                        if(erro4){
                                            console.log(dataHora(),"ERRO AO DELETAR: ",erro4); }
                                        else{
                                            //console.log(dataHora(),"Resposta do comentario recebida!");
                                        }
                                    });
                                    con_api.query(`UPDATE resultado_chat SET comen_resp='${message.body}', hora_come=NOW(), finalizado='sim' WHERE idchat='${message.chatId}'`, function (erro7, result7, fields7){
                                        if(erro7){
                                            console.log(dataHora(),"UPDATE ERRO: ",erro7); }
                                        else{
                                            let resposta_personalizada = ``;
                                            if(resposta[0].resposta < 7){resposta_personalizada = detrator;}
                                            else if(resposta[0].resposta >= 7 && resposta[0].resposta <= 8){resposta_personalizada = neutro;}
                                            else if(resposta[0].resposta > 8){resposta_personalizada = promotor;}
                                            else{resposta_personalizada = agradecimento;}

                                            //FINALIZA a pesquisa enviando uma resposta de acordo com a nota dada.
                                            enviarPergunta(message.from, resposta_personalizada);
                                        }
                                    });
                                }
                                else{
                                    //console.log(dataHora(),"Cliente ja respondeu a pesquisa");
                                    //enviarLocalizacao(message.from, 'Micks Telecom - Rua Camerindo Neves, 193 - Centro');
                                    //enviarLink(message.from, "https://www.youtube.com/watch?v=2UqI2Aw-OtE", "Teste link zap");
                                }
                            }
                        }
                    }
                }
            });
        }else{
            enviarPergunta(message.from, "Caro Cliente: não consigo compreender áudio ou figurinhas. ;)");
        }
    });
})
.catch((erro) => { console.log(dataHora(),"VENOM", erro); });

//Pesquisa se o número já existe, ou seja, já enviou a pesquisa para esse numero.
function numeroCadastrado(numero){
    return new Promise((resolve,reject)=>{
        const existe = `SELECT cel FROM pesquisa_chat WHERE cel = '${numero}';`;
        con_api.query(existe, function (erro, result, fields){
            if (erro){
                console.log(dataHora(),erro);
                reject(erro);
            }
            else{
                const resposta = JSON.parse(JSON.stringify(result));
                //if(resposta.length === 0){ resolve(1); } else{ resolve(2); }
                resolve(resposta.length);
            }
        });
    });
}

// Envia a pesquisa para o cliente
function enviaPesquisa(numero2, pergunta, nome){
   const perg = `Olá ${nome}. ${pergunta}`;
    return new Promise((resolve,reject)=>{
        if(repetido == false){
            clientEnvio.sendText(numero2, perg).then((result) => {
                console.log(dataHora(),'MSG Enviada p: ',nome,' - ', result.status);
                sucesso = true;
                chatId = result.to.remote._serialized;
                resolve();
            })
            .catch((erro)=>{
                console.log(dataHora(),`Erro: `, erro.status, " - ", erro.text);
                reject(erro);
            });
        }else{
            reject("erro");
        }
    });
}

//Grava na Tabela que foi enviada a pergunta
function gravaPergunta(id_pesquisa, nome, numero1, perfil, chatId, pergunta, usuario){
    return new Promise((resolve ,reject)=>{
        if(sucesso == true){
            let sql = `INSERT INTO pesquisa_chat (id_pesquisa, nome, cel, perfil, idchat, pergunta, usuario) values
            ("${id_pesquisa}", "${nome}", "${numero1}", "${perfil}", "${chatId}", "pergunta_enviada", "${usuario}")`;
            con_api.query(sql, function (erro, resultado, parametros) {
                if (erro){
                    reject(erro);
                }else{
                    resolve();
                }
            });
        }
    });
}

function acessar_BD(query){
    return new Promise((resolve , reject)=>{
        con_api.query(query, function (erro, result, fields){
            if (erro){
                const retorno = {
                    errorBD:"sim",
                    resposta:erro.sqlMessage
                }
                reject(retorno);
            }
            else{
                const resposta = JSON.parse(JSON.stringify(result));
                const retorno = {
                    errorBD:"nao",
                    resposta:resposta
                }
                resolve(retorno);
            }
        });
    })
}

function resposta_API(objeto, res, status=200, isOK=true){
    if(isOK){
        return res.status(status).json(objeto);
    }else{
        objeto.erroGeral = 'sim';
        log("Erro ao responder API", 'erro');
        return res.status(status).json(objeto);
    }
}

function log(obj, modo=''){
    if(modo === 'erro')   { console.log('\x1b[41m', dataHora(), obj, '\x1b[0m'); } // Fundo vermelho, cor padrão
else if(modo === 'info')  { console.log('\x1b[36m', dataHora(), obj, '\x1b[0m'); } // Azul claro
else if(modo === 'alerta'){ console.log('\x1b[33m', dataHora(), obj, '\x1b[0m'); } // Amarelo
else if(modo === 'temp')  { console.log('\x1b[5m',  dataHora(), obj, '\x1b[0m'); } // Piscando, cor padrão
else{                       console.log('\x1b[37m', dataHora(), obj, '\x1b[0m'); } // branco
}

class Zap{

    async enviarMsg(req, res){
        sucesso = false;
        repetido = true;
        chatId = "";
        var id_pesquisa = String(req.body.id_pesquisa);
        var nome     = String(req.body.nome);
        var usuario  = String(req.body.usuario);
        var perfil   = String(req.body.perfil);
        var numero1  = String(req.body.numero);
        var numero2  = String("55" + req.body.numero + "@c.us");
        var pergunta = String(req.body.pergunta);
        var sucesso1 = true;
        var sucesso2 = true;
/*
        await con_api.query("TRUNCATE Table pesquisa_chat;", (er1, res1, fild1)=>{
            if(er1){
                console.log(er1);
            }else{
                console.log("Tabela pesquisa_chat APAGADA");
            }
        });
*/
        await numeroCadastrado(numero1).then((resp)=>{
                if(resp == 0){
                    //console.log(dataHora(),"Novo numero. Enviando pergunta...");
                    repetido = false;
                }else{
                    repetido = true;
                    sucesso1 = false;
                    console.log(dataHora(),"Ja foi enviada uma mensagem para esse numero");
                    return res.status(200).json({
                        error: "sim",
                        code: 406,
                        msg: "Já foi enviada uma mensagem para esse número"
                    });
                }
            }).catch((erro)=>{
                repetido = true;
                sucesso1 = false;
                console.log(`Erro ao Buscar numero no banco de dados`);
                return res.status(200).json({
                    error: "sim",
                    code: 404,
                    msg: "Erro ao buscar número no banco de dados",
                    err: erro
                });
            });

        if(sucesso1 === true){
            await enviaPesquisa(numero2, pergunta, nome).then(()=>{
                let num = formatar_celular(numero1);
                const sql_num = `UPDATE clientes SET ultima_pesquisa= NOW() WHERE cel='${num}';`;
                con_api.query(sql_num, function (erro, resultado, parametros) {
                    if(erro){
                        console.log(erro);
                    }else{
                        //console.log(dataHora(),"Ultima_Pesquisa atualizada");
                    }
                });
                }).catch((error)=>{ 
                    sucesso2 = false;
                    console.log(dataHora(),"Erro ao enviar a pesquisa para o cliente");
                    const sql_erro = `INSERT INTO erros (nome, cel, perfil, erro) values ("${nome}", "${numero1}", "${perfil}", "Erro")`;
                    con_api.query(sql_erro, function (erro, resultado, parametros) { if(erro){ console.log(dataHora(), erro); } });
                    return res.status(200).json({
                        error: "sim",
                        code: 404,
                        msg: "Erro ao enviar a pesquisa para o cliente"
                    });
                });
    
            if(sucesso2 === true){
                await gravaPergunta(id_pesquisa, nome, numero1, perfil, chatId, pergunta, usuario).then(()=>{
                    //console.log(dataHora(),'Enviado e Gravado com sucesso');
                        return res.status(200).json({
                            error: "nao",
                            code: 200,
                            msg: "Enviado e Gravado com sucesso"
                        });
                    }).catch((error)=>{
                        console.log(dataHora(),`Erro ao Gravar na Tabela: ${error}`);
                        return res.status(200).json({
                            error: "sim",
                            code: 404,
                            msg: 'Erro ao Gravar na Tabela',
                            err: error
                        });
                    });
            }
        }


    }

    async online(req, res){
        //console.clear();
        const isConnected = await clientEnvio.isConnected();
        const getConnectionState = await clientEnvio.getConnectionState();
        console.log(dataHora(),"Conectado: ", isConnected);
        return res.status(200).json({
            isConnected : isConnected,
            getConnectionState, getConnectionState
        });
    }

    async existe(req, res){
        //console.clear();
        const numero = String("55" + req.body.numero + "@c.us");
        const chat = await clientEnvio.checkNumberStatus(numero)
        .then((result) => {
            //console.log(dataHora(),"WhatsApp OK ", req.body.numero);
            return res.status(200).json({
                error: "nao",
                code: result.status,
                msg: "WhatsApp OK",
                isBusiness: result.isBusiness,
                pode_receber_mensagens: result.canReceiveMessage,
                numero_existe: result.numberExists
            });
        }).catch((erro) => {
            console.log(dataHora(),"WhatsApp INVALIDO");
            return res.status(200).json({
                error: "sim",
                code: erro.status,
                msg: "WhatsApp INVALIDO",
                isBusiness: erro.isBusiness,
                pode_receber_mensagens: erro.canReceiveMessage
            });
        });
    }

    async link(req, res){
        //console.clear();
        const numero = String("55" + req.body.numero + "@c.us");
        const link = String(req.body.link);
        const descricao = String(req.body.descricao);

        if(numero == '' || descricao == '' || link == '' || numero == 'undefined' || descricao == 'undefined' || link == 'undefined'){
            return res.status(200).json({
                error: "sim",
                code: 404,
                msg: "Necessário enviar todos os campos preenchidos"
            });
        }

        await clientEnvio.sendLinkPreview(numero, link, descricao).then((result) => {
            console.log(dataHora(),'Link enviado');
            return res.status(200).json({
                error: "nao",
                code: 200,
                msg: "Link enviado"
            });
          })
          .catch((erro) => {
            console.error(dataHora(), 'Erro ao enviar link: ', erro);
            return res.status(200).json({
                error: "sim",
                code: 404,
                msg: "Link NÃO enviado"
            });
          });
        
    }

    async localizacao(req, res){
        //console.clear();
        const numero = String("55" + req.body.numero + "@c.us");
        const descricao = String(req.body.descricao);

        if(numero == '' || descricao == '' || numero == 'undefined' || descricao == 'undefined'){
            return res.status(200).json({
                error: "sim",
                code: 404,
                msg: "Necessário enviar todos os campos preenchidos"
            });
        }

        await clientEnvio.sendLocation(numero, '-14.226681', '-42.783443', descricao)
        .then((result) => {
            console.log(dataHora(),'Localizacao Enviada.');
            return res.status(200).json({
                error: "nao",
                code: 200,
                msg: "Localizacao enviada"
            });
        })
        .catch((erro) => {
            console.error(dataHora(),'Erro ao enviar localizacao: ', erro);
            return res.status(200).json({
                error: "sim",
                code: 404,
                msg: "Erro ao enviar localizacao"
            });
        });
        
    }

    async profile(req, res){
        let n = req.body.numero;
        if(req.body.numero.length == 11){
            if(req.body.numero.indexOf('9') == 2){
               n = req.body.numero.replace('9', '');
            }
        }

        const numero = String("55" + n + "@c.us");
        //console.log(dataHora(), "Obtendo Profile: ", numero);
        await clientEnvio.getProfilePicFromServer(numero)
        .then((result) => {
            //console.log(dataHora(),"Link do Profile: ", result);
            return res.status(200).json({
                error: "nao",
                foto: result
            });
        }).catch((erro) => {
            console.log(dataHora(), "Foto Indisponível");
            return res.status(200).json({
                error: "sim",
                code: erro
            });
        });
    }

    //Login na Página
    async login(req, res) {
        console.log(dataHora(),"Validando Usuário");
        const usuario = req.body.usuario;
        const senha = req.body.senha;
        const sql = `SELECT usuario , senha FROM usuarios  WHERE usuario = '${usuario}' AND senha = '${senha}';`
    
        await con_api.query(sql, function (err, result, fields) {
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
                    console.log(dataHora(),"Usuário ou senha inválidos");
                    return res.status(200).json({
                        error: 'sim',
                        code: 401,
                        msg: "Usuário ou senha inválidos"
                    });
                }else if(resposta.length === 1){
                    //console.log(dataHora(),"Usuário OK");
                    return res.status(200).json({
                        error: 'nao',
                        code: 200,
                        msg: "Login efetuado com sucesso"
                    });
                }
    
            }
        });
    }

    //Perguntas
    async cadastrar_pergunta(req, res){
        console.log(dataHora(),"Cadastrando Pergunta");
        const topico = req.body.topico;
        const pergunta = req.body.pergunta;
        const sql = `INSERT INTO perguntas (topico, pergunta) values ("${topico}", "${pergunta}");`
        await con_api.query(sql, function (err, result, fields) {
            if (err){
                console.log(dataHora(),"Erro ao cadastrar pergunta no BD");
                return res.status(200).json({
                    error: true,
                    code: 404,
                    msg: "Erro ao cadastrar pergunta no BD",
                    err: err
                });
            }else{
                console.log(dataHora(),'Pergunta Gravada com sucesso');
                return res.status(200).json({
                    error: "nao",
                    code: 200,
                    msg: "Pergunta Gravada com sucesso"
                });
    
            }
        });
    }

    async editar_pergunta(req, res){
        console.log(dataHora(),"Editando Pergunta");
        const topico = req.body.topico;
        const pergunta = req.body.pergunta;
        const id = req.body.id;
        const sql = `UPDATE perguntas SET topico='${topico}', pergunta='${pergunta}' WHERE id='${id}'`;
        await con_api.query(sql, function (err, result, fields) {
            if (err){
                console.log(dataHora(),"Erro ao editar pergunta no BD");
                return res.status(200).json({
                    error: true,
                    code: 404,
                    msg: "Erro ao editar pergunta no BD",
                    err: err
                });
            }else{
                console.log(dataHora(),'Pergunta editada com sucesso');
                return res.status(200).json({
                    error: "nao",
                    code: 200,
                    msg: "Pergunta editada com sucesso"
                });
    
            }
        });
    }

    async listar_perguntas(req, res){
        //console.log(dataHora(),"Listando Perguntas");
        const sql = "SELECT *, DATE_FORMAT(hora, '%d/%m/%Y %H:%i') as data_hora  FROM perguntas;";
        await con_api.query(sql, function (err, result, fields) {
            if (err){
                console.log(dataHora(),"Erro ao listar pergunta no BD");
                return res.status(200).json({
                    error: "sim",
                    code: 404,
                    msg: "Erro ao listar pergunta no BD",
                    err: err
                });
            }else{
                //console.log(dataHora(),'Sucesso ao listar Perguntas');
                const resposta = JSON.parse(JSON.stringify(result));
                return res.status(200).json({
                    error: "nao",
                    code: 200,
                    msg: "Sucesso ao listar Perguntas",
                    resposta: resposta
                });
            }
        });
    }

    async deletar_pergunta(req, res){
        const id = req.body.id;
        console.log(dataHora(),"Deletando Pergunta");
        let sql = `DELETE FROM perguntas WHERE id=${id}`;
        await con_api.query(sql, function (erro, resultado, parametros) {
            if (erro){
                console.log(dataHora(),"Erro ao deletar pergunta", erro);
                return res.status(200).json({
                    error: "sim",
                    code: 404,
                    msg: "Erro ao deletar pergunta",
                    error, erro
                });
            }else{
                console.log(dataHora(),"Pergunta deletada");
                var resposta = JSON.parse(JSON.stringify(resultado));
                return res.status(200).json({
                    error: "nao",
                    code: 200,
                    msg: "Pergunta deletada",
                    resposta : resposta
                });
            }
        });
    }

    //Pesquisa
    async listar_pesquisas(req, res){
        //console.log(dataHora(),"Listando Pesquisas");
        const sql = "SELECT *, DATE_FORMAT(hora, '%d/%m/%Y %H:%i') as data_hora  FROM pesquisas_enviadas;";
        await con_api.query(sql, function (err, result, fields) {
            if (err){
                console.log(dataHora(),"Erro ao listar pesquisas no BD");
                return res.status(200).json({
                    error: "sim",
                    code: 404,
                    msg: "Erro ao listar pesquisas no BD",
                    err: err
                });
            }else{
                //console.log(dataHora(),'Sucesso ao listar pesquisas');
                const resposta = JSON.parse(JSON.stringify(result));
                return res.status(200).json({
                    error: "nao",
                    code: 200,
                    msg: "Sucesso ao listar pesquisas",
                    resposta: resposta
                });
            }
        });
    }

    //Pegar perfis
    async pegar_perfis(req, res){
        //console.log(dataHora(),"Listando Perfis");
        const sql = "SELECT * FROM perfis ORDER BY perfil;";
        await con_api.query(sql, function (err, result, fields) {
            if (err){
                console.log(dataHora(),"Erro ao listar Perfis no BD");
                return res.status(200).json({
                    error: "sim",
                    code: 404,
                    msg: "Erro ao listar Perfis no BD",
                    err: err
                });
            }else{
                //console.log(dataHora(),'Sucesso ao listar Perfis');
                const resposta = JSON.parse(JSON.stringify(result));
                return res.status(200).json({
                    error: "nao",
                    code: 200,
                    msg: "Sucesso ao listar Perfis",
                    resposta: resposta
                });
            }
        });
    }

    async cadastrar_pesquisas(req, res){
        console.log(dataHora(),"Cadastrando Pesquisa");
        const topico = req.body.topico;
        const pergunta = req.body.pergunta;
        const usuario = req.body.usuario;
        const perfis = req.body.perfis;
        const sql = `INSERT INTO pesquisas_enviadas (topico, pergunta, usuario, perfis) values ("${topico}", "${pergunta}", "${usuario}", "${perfis}");`;
        await con_api.query(sql, function (err, result, fields) {
            if (err){
                console.log(dataHora(),"Erro ao cadastrar Pesquisa no BD");
                return res.status(200).json({
                    error: true,
                    code: 404,
                    msg: "Erro ao cadastrar Pesquisa no BD",
                    err: err
                });
            }else{
                console.log(dataHora(),'Pesquisa Gravada com sucesso');
                return res.status(200).json({
                    error: "nao",
                    code: 200,
                    msg: "Pesquisa Gravada com sucesso"
                });
    
            }
        });
    }

    //Buscar todos os clientes para enviar pesquisa
    async todos_perfis(req, res){
        let dias = req.body.dias;
        console.log(dataHora(),"Listando Todos os Clientes");

        const sql = `SELECT *, DATEDIFF(NOW(),ultima_pesquisa) AS periodo FROM clientes 
        WHERE DATEDIFF(NOW(),ultima_pesquisa) > ${dias} OR ultima_pesquisa IS NULL 
        AND zap_valido='sim' AND aceita_pesquisa='sim';`;

        await con_api.query(sql, function (err, result, fields) {
            if (err){
                console.log(dataHora(),"Erro ao listar Todos os Clientes no BD");
                return res.status(200).json({
                    error: "sim",
                    code: 404,
                    msg: "Erro ao listar Todos os Clientes no BD",
                    err: err
                });
            }else{
                console.log(dataHora(),'Sucesso ao listar Todos os Clientes');
                const resposta = JSON.parse(JSON.stringify(result));
                return res.status(200).json({
                    error: "nao",
                    code: 200,
                    msg: "Sucesso ao listar Todos os Clientes",
                    resposta: resposta
                });
            }
        });
    }

    //Buscar clientes por PERFIL para enviar pesquisa
    async perfis_selecionados(req, res){
        let selecionados = req.body.perfis;
        let dias = req.body.dias;
        console.log(dataHora(),"Listando Clientes por Perfil");

        const sql = `SELECT * FROM clientes WHERE zap_valido='sim' AND aceita_pesquisa='sim'
                    AND perfil IN (${selecionados})
                    AND (DATEDIFF(NOW(),ultima_pesquisa) > ${dias} OR ultima_pesquisa IS NULL);`;

        await con_api.query(sql, function (err, result, fields) {
            if (err){
                console.log(dataHora(),"Erro ao listar Clientes por Perfil no BD");
                return res.status(200).json({
                    error: "sim",
                    code: 404,
                    msg: "Erro ao listar Clientes por Perfil no BD",
                    err: err
                });
            }else{
                console.log(dataHora(),'Sucesso ao listar Clientes por Perfil');
                const resposta = JSON.parse(JSON.stringify(result));
                return res.status(200).json({
                    error: "nao",
                    code: 200,
                    msg: "Sucesso ao listar Clientes por Perfil",
                    resposta: resposta
                });
            }
        });
    }

    //Buscar clientes por data de venda.
    async datas(req, res){
        let inicio = req.body.inicio;
        let fim = req.body.fim;
        let dias = req.body.dias;
        //console.log(dataHora(),"Listando Clientes por Data de Venda");

        const sql1 = `SELECT * FROM clientes WHERE
                        zap_valido='sim'
                        AND aceita_pesquisa='sim'
                        AND (DATEDIFF(NOW(),ultima_pesquisa) > ${dias} OR ultima_pesquisa IS NULL)
                        AND data_venda BETWEEN DATE('${inicio}') AND DATE('${fim}');`;

        await con_api.query(sql1, function (err, result, fields) {
            if (err){
                console.log(dataHora(),"Erro ao listar Clientes por Data de Venda no BD");
                return res.status(200).json({
                    error: "sim",
                    code: 404,
                    msg: "Erro ao listar Clientes por Data de Venda no BD",
                    err: err
                });
            }else{
                //console.log(dataHora(),'Sucesso ao listar Clientes por Data de Venda');
                const resposta = JSON.parse(JSON.stringify(result));
                return res.status(200).json({
                    error: "nao",
                    code: 200,
                    msg: "Sucesso ao listar Clientes por Data de Venda",
                    resposta: resposta
                });
            }
        });
    }

    //Cadastrar Clientes
    async cadastrar_cliente(req, res){
        console.log(dataHora(),"Cadastrando Cliente");
        const nome = req.body.nome;
        const cod_cliente = req.body.cod_cliente;
        const perfil = req.body.perfil;
        const cidade = req.body.cidade;
        const cel = req.body.cel;
        const email = req.body.email;
        const zap_valido = req.body.zap_valido;
        const aceita_pesquisa = req.body.aceita_pesquisa;

        const sql = `INSERT INTO clientes (nome, cod_cliente, perfil, cidade, cel, email, zap_valido, aceita_pesquisa) values ("${nome}", "${cod_cliente}", "${perfil}", "${cidade}", "${cel}", "${email}", "${zap_valido}", "${aceita_pesquisa}");`
        await con_api.query(sql, function (err, result, fields) {
            if (err){
                console.log(dataHora(),"Erro ao cadastrar Cliente no BD");
                return res.status(200).json({
                    error: true,
                    code: 404,
                    msg: "Erro ao cadastrar Cliente no BD",
                    err: err
                });
            }else{
                console.log(dataHora(),'Cliente Gravado com sucesso');
                return res.status(200).json({
                    error: "nao",
                    code: 200,
                    msg: "Cliente Gravado com sucesso"
                });
    
            }
        });
    }

    //Editar Clientes
    async editar_cliente(req, res){
        console.log(dataHora(),"Editando Cliente");
        const id = req.body.id;
        const nome = req.body.nome;
        const cod_cliente = req.body.cod_cliente;
        const perfil = req.body.perfil;
        const cidade = req.body.cidade;
        const cel = req.body.cel;
        const email = req.body.email;
        const zap_valido = req.body.zap_valido;
        const aceita_pesquisa = req.body.aceita_pesquisa;

        const sql2 = `UPDATE clientes SET nome='${nome}', cod_cliente='${cod_cliente}', perfil='${perfil}', cidade='${cidade}', cel='${cel}', email='${email}', zap_valido='${zap_valido}', aceita_pesquisa='${aceita_pesquisa}' WHERE id='${id}';`;       
        await con_api.query(sql2, function (err, result, fields) {
            if (err){
                console.log(dataHora(),"Erro ao editar Cliente no BD");
                return res.status(200).json({
                    error: true,
                    code: 404,
                    msg: "Erro ao editar Cliente no BD",
                    err: err
                });
            }else{
                console.log(dataHora(),'Cliente Editado com sucesso');
                return res.status(200).json({
                    error: "nao",
                    code: 200,
                    msg: "Cliente Editado com sucesso",
                    result: result
                });
    
            }
        });
    }

    //Deletar Cliente
    async deletar_cliente(req, res){
        const id = req.body.id;
        console.log(dataHora(),"Deletando Cliente");
        let sql = `DELETE FROM clientes WHERE id=${id}`;
        await con_api.query(sql, function (erro, resultado, parametros) {
            if (erro){
                console.log(dataHora(),"Erro ao deletar cliente", erro);
                return res.status(200).json({
                    error: "sim",
                    code: 404,
                    msg: "Erro ao deletar cliente",
                    error, erro
                });
            }else{
                console.log(dataHora(),"Cliente deletado");
                var resposta = JSON.parse(JSON.stringify(resultado));
                return res.status(200).json({
                    error: "nao",
                    code: 200,
                    msg: "Cliente deletado",
                    resposta : resposta
                });
            }
        });
    }

    //Listar Clientes
    async listar_clientes(req, res){
        //console.log(dataHora(),"Listando Clientes");
        const sql = req.body.sql;
        await con_api.query(sql, function (err, result, fields) {
            if (err){
                console.log(dataHora(),"Erro ao listar Clientes no BD");
                return res.status(200).json({
                    error: "sim",
                    code: 404,
                    msg: "Erro ao listar Clientes no BD",
                    err: err
                });
            }else{
                //console.log(dataHora(),'Sucesso ao listar Clientes');
                const resposta = JSON.parse(JSON.stringify(result));
                return res.status(200).json({
                    error: "nao",
                    code: 200,
                    msg: "Sucesso ao listar Clientes",
                    resposta: resposta
                });
            }
        });
    }

    //Listar Clientes por periodo
    async listar_periodo(req, res){
        const dias = req.body.dias;
        console.log(dataHora(),"Listando Clientes por período");
        const sql1 = `SELECT *, DATEDIFF(NOW(),ultima_pesquisa) AS periodo FROM clientes WHERE DATEDIFF(NOW(),ultima_pesquisa) > ${dias} OR ultima_pesquisa IS NULL AND zap_valido='sim' AND aceita_pesquisa='sim';`;
        const sql2 = `SELECT *, DATEDIFF(NOW(),ultima_pesquisa) AS periodo FROM clientes WHERE DATEDIFF(NOW(),ultima_pesquisa) > ${dias};`;
        await con_api.query(sql1, function (err, result, fields) {
            if (err){
                console.log(dataHora(),"Erro ao listar Clientes no BD");
                return res.status(200).json({
                    error: "sim",
                    code: 404,
                    msg: "Erro ao listar Clientes no BD",
                    err: err
                });
            }else{
                console.log(dataHora(),'Sucesso ao listar Clientes por periodo');
                const resposta = JSON.parse(JSON.stringify(result));
                return res.status(200).json({
                    error: "nao",
                    code: 200,
                    msg: "Sucesso ao listar Clientes",
                    resposta: resposta
                });
            }
        });
    }

    //Listar IDs de Clientes
    async listar_ids(req, res){
        const dias = req.body.dias;
        console.log(dataHora(),"Listando IDs de Clientes");
        await con_api.query("SELECT id from clientes;", function (err, result, fields) {
            if (err){
                console.log(dataHora(),"Erro ao listar IDs no BD");
                return res.status(200).json({
                    error: "sim",
                    code: 404,
                    msg: "Erro ao listar IDs no BD",
                    err: err
                });
            }else{
                console.log(dataHora(),'Sucesso ao listar IDs por periodo');
                const resposta = JSON.parse(JSON.stringify(result));
                return res.status(200).json({
                    error: "nao",
                    code: 200,
                    msg: "Sucesso ao listar IDs",
                    resposta: resposta
                });
            }
        });
    }

    //Mostrar Cliente
    async mostrar_cliente(req, res){
        const id = req.params.id;
        console.log(dataHora(),"Mostrando Cliente");
        const sql = `SELECT * FROM clientes WHERE id = ${id};`;
        await con_api.query(sql, function (err, result, fields) {
            if (err){
                console.log(dataHora(),"Erro ao listar Cliente no BD");
                return res.status(200).json({
                    error: "sim",
                    code: 404,
                    msg: "Erro ao listar Cliente no BD",
                    err: err
                });
            }else{
                console.log(dataHora(),'Sucesso ao listar Cliente');
                const resposta = JSON.parse(JSON.stringify(result));
                return res.status(200).json({
                    error: "nao",
                    code: 200,
                    msg: "Sucesso ao listar Cliente",
                    resposta: resposta
                });
            }
        });
    }

    //Verificar se o número existe na Tabela Clientes
    async existe_numero(req, res){
        const cel = req.body.numero;
        //console.log(dataHora(),"Verificando Numero");
        const sql = `SELECT * FROM clientes WHERE cel='${cel}';`;
        await con_api.query(sql, function (err, result, fields) {
            if (err){
                console.log(dataHora(),"Erro ao verificar número na tabela");
                return res.status(200).json({
                    error: "sim",
                    code: 404,
                    msg: "Erro ao verificar número na tabela",
                    err: err
                });
            }else{
                //console.log(dataHora(),'Sucesso ao verificar número na tabela');
                const resposta = JSON.parse(JSON.stringify(result));
                return res.status(200).json({
                    error: "nao",
                    code: 200,
                    msg: "Sucesso ao verificar número na tabela",
                    resposta: resposta
                });
            }
        });
    }

    async teste(req, res){
        const query = `SELECT nome, cel, perfil, campanha FROM clientes WHERE cel='${req.body.cel}';`;
        await micks.acessar_BD(query).then((result)=>{
            micks.resposta_API(result, res, 200, true);
        }).catch((erro)=>{
            micks.log(erro, 'erro');
            micks.resposta_API(erro, res, 200, false);
        });
    }

}

module.exports = new Zap();