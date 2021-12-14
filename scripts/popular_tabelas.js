const dataHora = require('./config/dataHora');
const con_api = require('./config/conexao_api');

console.log(dataHora(),"Iniciando Inserção em Tabelas");

function resultado_chat(){
    return new Promise((resolve ,reject)=>{
        let sql1 = `INSERT INTO resultado_chat (id_pesquisa, nome, cel, perfil, campanha, idchat, pergunta, resposta, hora_resp, comentario, comen_resp, hora_come, finalizado, usuario) values
        ("1", "Cliente - ${Math.floor(500* Math.random() + 1)}", "77988188514", "Geral", "Novembro Azul", "5577988188514c.us", " O que vc acha do atendimento da Micks?", "${Math.floor(10* Math.random() + 0)}", NOW(), "Deixe um comentário sobre a nota que você atribuiu", "O atendimento é X", NOW(), "sim", "Lucas");`;

        let sql2 = `INSERT INTO resultado_chat (id_pesquisa, nome, cel, perfil, campanha, idchat, pergunta, resposta, hora_resp, comentario, comen_resp, hora_come, finalizado, usuario) values
        ("2", "Pessoa - ${Math.floor(500* Math.random() + 1)}", "77988188514", "Gamer", "Natal 2021", "5577988188514c.us", " O que vc acha dos preços e planos da Micks?", "${Math.floor(10* Math.random() + 0)}", NOW(), "Deixe um comentário sobre a nota que você atribuiu", "Os preços são Y", NOW(), "sim", "Alécia");`;


        con_api.query(sql2, function (erro, resultado, parametros) {
            if (erro){
                reject(erro);
            }else{
                resolve("OK");
            }
        });

    });
}

async function chamar(){
    for (let index = 0; index < 120; index++) {
        console.log(index);
        await resultado_chat().then((res)=>{
            console.log(dataHora(),res);
        }).catch((er)=>{
            console.log(dataHora(),er);
        });
    }
    process.exit(0);
}

chamar();