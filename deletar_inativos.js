const dataHora = require('../config/dataHora');
const con_api = require('../config/conexao_api');
const integrator = require('../config/conexao_integrator');
const axios = require('axios');
var listaClientes = [];
var numeroClientes = 0;
var numerosValidos = 0;
var numerosInvalidos = 0;
var deletados = 0;

console.log(dataHora(),'Iniciando script de verificacao de Cliente Ativos');

function clientes(){
    return new Promise((resolve,reject)=>{
        con_api.query('SELECT * FROM clientes', function (erro, result, fields){
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

function testarCliente(cod_cli){
    return new Promise((resolve,reject)=>{
        integrator.query(`SELECT * FROM clientes c WHERE c.codcli='${cod_cli}' AND  c.ativo='N';`, function (erro, result, fields){
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

function deletarCliente(cod_cli){
    return new Promise((resolve,reject)=>{
        con_api.query(`DELETE FROM clientes WHERE cod_cliente='${cod_cli}';`, function (erro, result, fields){
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

async function getTodos() {
    for (const [index, cliente] of listaClientes.entries()) {
        const resposta = await testarCliente(cliente.cod_cliente);
        if(resposta[0] != undefined){
            console.log(dataHora(),`${index+1} Verificados: `, resposta[0].nome_cli, " - ", resposta[0].codcli);
            numerosInvalidos++;
            await deletarCliente(cliente.cod_cliente)
            .then((res)=>{
                deletados++;
            })
            .catch((err)=>{
                console.log(dataHora(), "Erro ao deletar")
            });
        }
        
    }

    console.log(dataHora(),"Total Clientes: ", numeroClientes);
    console.log(dataHora(),"Clientes Cancelados: ", numerosInvalidos);
    console.log(dataHora(),"Clientes Deletados: ", deletados);

    console.log(dataHora(),"FIM da Verificacao de Clientes Ativos");
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