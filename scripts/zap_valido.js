const dataHora = require('../config/dataHora');
const con_api = require('../config/conexao_api');
const axios = require('axios');
var listaClientes = [];
var numeroClientes = 0;
var numerosValidos = 0;
var numerosInvalidos = 0;

console.log(dataHora(),'Iniciando script de verificacao de numero valido de WhatzApp');

function clientes(){
    return new Promise((resolve,reject)=>{
        const cli = 'SELECT id, TRIM(cel) AS celular FROM clientes WHERE perfil= "Geral";'; //  WHERE perfil= "Geral"
        con_api.query(cli, function (erro, result, fields){
            if (erro){
                console.log(dataHora(),erro);
                reject(erro);
            }
            else{
                const resposta = JSON.parse(JSON.stringify(result));
                //if(resposta.length === 0){ resolve(1); } else{ resolve(2); }
                resolve(resposta);
            }
        });
    });
}

function testarNumeros(item){
    return new Promise((resolve,reject)=>{
        const formatado = item.celular.replace(/\D+/g, "");
        //console.log("Cliente: ", item);
        axios.post('http://localhost:3366/existe', {
            usuario: 'lucas',
            senha: '3LhaAqzpaKyyC&a%G',
            numero: formatado
        })
        .then(function (response) {
            resolve(response);
        })
        .catch(function (error) {
            reject(error);
        });
    });
}

async function getTodos() {
    let estado = 'nao';
    for (const [index, cliente] of listaClientes.entries()) {
        const resposta = await testarNumeros(cliente);
        console.log(dataHora(),`${index+1} Verificados: `, resposta.data.msg, " - ", cliente);
        if(resposta.data.pode_receber_mensagens){
            numerosValidos++;
            estado = 'sim';
        }
        else{
            numerosInvalidos++;
            estado = 'nao';
        }

        // Altera na Tabela conforme o retorno do número válido ou não.
        con_api.query(`UPDATE clientes SET zap_valido='${estado}' WHERE id='${cliente.id}';`, function (erro, result, fields){
            if (erro){
                console.log(dataHora(),erro);
            }
            else{
                //const resposta = JSON.parse(JSON.stringify(result));
                //console.log(dataHora(),resposta);
            }
        });
    }
  
    console.log(dataHora(),"FIM da Verificacao de numero de WhatzApp validos");
    console.log("Numeros Validos: ", numerosValidos);
    console.log("Numeros Invalidos: ", numerosInvalidos);
    process.exit(0);
}

async function usar(){
    await clientes().then((res)=>{
        console.log(dataHora(),"Sucesso: ", res.length," registros");
        listaClientes = res;
        numeroClientes = res.length;
        
    }).catch((erro)=>{
        console.log(dataHora(),"Erro ",erro);
    });

    await getTodos();

}

usar();