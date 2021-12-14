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
            }else{
                return formatado[0];
            }
        }else if(formatado.length === 1){
            return formatado;
        }else{
            return "Numero Invalido";
        }
    }
}

function tempo_entre_envios(){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{ 
                resolve("OK");
        }, 10000);
    });
}

let listaClientes = [0,1,2,3];

async function usar(){
    for (const [index, cliente] of listaClientes.entries()) {
        await tempo_entre_envios()
        console.log(cliente);
    }
}

usar();

/*
console.log(numeros("A nota para a micks é 07"));
console.log(numeros("A nota 6,7 para a micks"));
console.log(numeros("A nota para a micks é 7.5"));
console.log(numeros("Nota 6,4"));
console.log(numeros("Minha nota é 10"));
console.log(numeros("45"));
console.log(numeros("r=7"));
console.log(numeros("R=7"));
console.log(numeros("Resposta = 7"));
console.log(numeros("Boa tarde"));
*/