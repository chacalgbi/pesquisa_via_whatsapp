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

console.log(formatar_celular("77 988188514"));