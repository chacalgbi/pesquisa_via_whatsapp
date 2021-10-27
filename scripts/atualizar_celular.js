const dataHora = require('../config/dataHora');
const con_api = require('../config/conexao_api');
const axios = require('axios');
var listaClientes = [];
var contador = 0;

function clientes(){
    return new Promise((resolve,reject)=>{
        const cli = 'SELECT id, cel FROM clientes WHERE perfil= "Geral";'; //  WHERE perfil= "Geral"
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

function atualizar_tabela(numero, id){
    return new Promise((resolve,reject)=>{
        con_api.query(`UPDATE clientes SET cel='${numero}' WHERE id='${id}';`, function (erro, result, fields){
            if (erro){
                reject(erro);
            }
            else{
                const resposta = JSON.parse(JSON.stringify(result));
                resolve(resposta);
            }
        });
    });
}

async function getTodos() {
    for (const [index, cliente] of listaClientes.entries()) {
        let numero = formatar_celular(cliente.cel);
        if(numero == 'erro'){
            numero = '';
        }
        //console.log(dataHora(), numero);

        // Altera na Tabela conforme o retorno do número.
        await atualizar_tabela(numero, cliente.id).then((res)=>{
            //console.log("OK");
            contador++;
        }).catch((erro)=>{
            console.log("Erro ao gravar: ",erro);
        });
    }
  
    console.log(dataHora(),"FIM da FORMATAÇÃO de número de celular");
    console.log(dataHora()," - ", contador ," Registros Alterados");
    process.exit(0);
}

async function usar(){
    await clientes().then((res)=>{
        console.log(dataHora(),"Sucesso: ", res.length," registros");
        listaClientes = res;
        
    }).catch((erro)=>{
        console.log(dataHora(),"Erro ",erro);
    });

    await getTodos();

}

console.log(dataHora(),'Iniciando script de FORMATAÇÃO de número de celular');
usar();