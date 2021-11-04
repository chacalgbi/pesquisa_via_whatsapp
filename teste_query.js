const con_api = require('./config/conexao_api');
var colog = require('colog');
const dataHora = require('./config/dataHora');


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

function acessar_BD(query){
    return new Promise((resolve , reject)=>{
        con_api.query(query, function (erro, result, fields){
            if (erro){
                console.log("Erro na Consulta SQL:",erro.sqlMessage);
                const retorno = {
                    errorBD: "sim",
                    resposta: erro.sqlMessage
                }
                reject(retorno);
            }
            else{
                const resposta = JSON.parse(JSON.stringify(result));
                const retorno = {
                    errorBD: "nao",
                    resposta: resposta
                }
                resolve(retorno);
            }
        });
    })
}

function resposta_API(objeto, res, status= 200, isOK= true){
    if(isOK){
        return res.status(status).json(objeto);
    }else{
        console.log("Erro ao responder API");
    }
}

async function exec(){
    const pegar = `SELECT nome, cel, perfil, campanha FROM clientes WHERE cel='(77) 99977-0606';`;
    const resultado = await acessar_BD(pegar);
    console.log(resultado,  'color: red;');
}

//exec();

function log(obj, modo=''){
         if(modo === 'erro')  { console.log('\x1b[41m', dataHora(), obj, '\x1b[0m'); }
    else if(modo === 'info')  { console.log('\x1b[36m', dataHora(), obj, '\x1b[0m'); }
    else if(modo === 'alerta'){ console.log('\x1b[33m', dataHora(), obj, '\x1b[0m'); }
    else if(modo === 'temp')  { console.log('\x1b[5m',  dataHora(), obj, '\x1b[0m'); }
    else{                       console.log('\x1b[37m', dataHora(), obj, '\x1b[0m'); }
}

log("teste erro", "erro");
log("teste info", "info");
log("teste alerta", "alerta");
log("teste temp", "temp");
log("teste normal");


/*
console.log('\x1b[5m%s\x1b[0m', "Teste 1");
console.log('\x1b[7m%s\x1b[0m', "Teste 2");
console.log('\x1b[8m%s\x1b[0m', "Teste 3");
console.log('\x1b[30m%s\x1b[0m', "Teste 4");
console.log('\x1b[31m%s\x1b[0m', "Teste 5");
console.log('\x1b[32m%s\x1b[0m', "Teste 6");
console.log('\x1b[33m%s\x1b[0m', "Teste 7");

console.log('\x1b[34m%s\x1b[0m', "Teste 8");
console.log('\x1b[35m%s\x1b[0m', "Teste 9");
console.log('\x1b[36m%s\x1b[0m', "Teste 10");
console.log('\x1b[37m%s\x1b[0m', "Teste 11");
console.log('\x1b[40m%s\x1b[0m', "Teste 12");
console.log('\x1b[41m%s\x1b[0m', "Teste 13");
console.log('\x1b[42m%s\x1b[0m', "Teste 14");

console.log('\x1b[43m%s\x1b[0m', "Teste 15");
console.log('\x1b[44m%s\x1b[0m', "Teste 16");
console.log('\x1b[45m%s\x1b[0m', "Teste 17");
console.log('\x1b[46m%s\x1b[0m', "Teste 18");
console.log('\x1b[47m%s\x1b[0m', "Teste 19");
*/