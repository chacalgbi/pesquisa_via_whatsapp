var login = sessionStorage.login;
const ip = sessionStorage.ip;
var perguntas = '';
var perfis = '';
var num_pesquisas = 0;
var total = 100;
var enviados = 50;
var listaClientes = [];
var id_pesq = 0;

//CSV
const myForm = document.getElementById("myForm");
const csvFile = document.getElementById("csvFile");
var data_csv = [];
var clientes_com_zap_validos = [];

function csvToArray(str, delimiter = ",") {
    const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");
    const arr = rows.map(function (row) {
        const values = row.split(delimiter);
        const el = headers.reduce(function (object, header, index) {
        object[header] = values[index];
        return object;
        }, {});
        return el;
    });
    return arr;
}

myForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const input = csvFile.files[0];
    if(input){
      const reader = new FileReader();
      reader.onload = function (e) {
          const text = e.target.result;
          const texto1 = text.replace(/(\"|\r)/g, '');
          data_csv = csvToArray(texto1);
          data_csv.pop();
          //console.log(data_csv);
          document.getElementById('btn_verificar').innerText = `Verificar Celular de ${data_csv.length} clientes`;
          document.getElementById('btn_verificar').style.display = 'block'
      };
      reader.readAsText(input, "ISO-8859-1");
    }else{
      Swal.fire({
        icon: 'info',
        title: 'Oops...',
        text: 'Selecione um arquivo .CSV !'
      });
    }

    
});
//CSV

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

// Busca na API VENOM se o número é um WhatsApp válido
function verificar_zap_valido(cel){
  const formatado = cel.replace(/\D+/g, "");
  return new Promise((resolve,reject)=>{
    axios.post(`${ip}existe`, {
      usuario: sessionStorage.usuario,
      senha: sessionStorage.senha,
      numero: formatado
    }).then( function (response) { resolve(response);
    }).catch(function (error)    { reject(error); });
  });
}

//Faz uma requisição enviando o número do CELULAR, verifica se o número já está na lista de clientes:
// - Se não existir, faz um INSERT enviando: Nome, cod_cli, perfil=Geral, campanha, celular, email e ultima_pesquisa=NOW()
// - Se existir , faz um UPDATE atualizando o campo campanha.
function inserir_ou_atualizar(cliente){
  let num = formatar_celular(cliente.celular) // coloca no formato que está na tabela cliente antes de comparar
  return new Promise((resolve,reject)=>{
    axios.post(`${ip}existe_numero`, {
      usuario: sessionStorage.usuario,
      senha: sessionStorage.senha,
      numero: num
    }).then(function(response){

      //Se NÃO existir, faz o insert
      if(response.data.resposta.length == 0){
        console.log("Não existe na Tabela");
        resolve("OK");
      }
      // Se existir, faz o update
      else{
        console.log("Existe na Tabela", response.data.resposta);
        resolve("OK");
      }
    }).catch(function(error){
      reject(error);
    });

  });
}

// Após verificar o número coloca na tabela.
async function Verificar_ZAP_CSV(){
  for (const [index, cliente] of data_csv.entries()) {
    const resposta = await verificar_zap_valido(cliente.celular);
    if(resposta.data.msg == "WhatsApp OK"){
      $("#corpo").append(`<tr><td>${index+1}</td><td>${cliente.nome_cliente}</td><td>${cliente.celular}</td><td><img src='./assets/img/ok.jpg' width='40' height='40'></img></td></tr>`);
      clientes_com_zap_validos.push(cliente);

      //Se o número for um WhatsApp válido, insere ou atualiza na tabela cliente.
      await inserir_ou_atualizar(cliente);
    }
    else{
      $("#corpo").append(`<tr><td>${index+1}</td><td>${cliente.nome_cliente}</td><td>${cliente.celular}</td><td><img src='./assets/img/erro.jpg' width='40' height='40'></img></td></tr>`);
    }
  }

  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: `${clientes_com_zap_validos.length} clientes tem celular com WhatsApp válidos`,
    showConfirmButton: false,
    timer: 4000
  });

}

function sair(){
  sessionStorage.login = 'NOT';
  sessionStorage.ip = '...';
  sessionStorage.usuario = "...";
  sessionStorage.senha = "...";
  location.replace("index.html");
}

if(login != 'OK'){
    document.getElementById('msg').innerHTML = "Acesso não autorizado";
    setTimeout(function() {
      location.replace("index.html");
    }, 500);
}else{

}