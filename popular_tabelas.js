const dataHora = require('./config/dataHora');
const con_api = require('./config/conexao_api');

console.log(dataHora(),"Iniciando Inserção em Tabelas");

function resultado_chat(){
    return new Promise((resolve ,reject)=>{
        let sql = `INSERT INTO resultado_chat (id_pesquisa, nome, cel, perfil, idchat, pergunta, resposta) values
        ("1", "Lucas", "77988188514", "GBI DEV_MICKS", "5577988188514c.us", "Qual a probabilidade de você indicar a Micks para um conhecido?", "${Math.floor(10* Math.random() + 1)}");`;

        con_api.query(sql, function (erro, resultado, parametros) {
            if (erro){
                reject(erro);
            }else{
                resolve("Pergunta Gravada com sucesso!");
            }
        });

    });
}

async function chamar(){
    for (let index = 0; index < 50; index++) {
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