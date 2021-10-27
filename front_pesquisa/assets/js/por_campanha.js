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

  //console.log(clientes_com_zap_validos);
  exibir_clientes(clientes_com_zap_validos);

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

//Insere a pergunta selecionada na caixa de texto
function inserir_pergunta(){
  let texto = document.getElementById('selecionar_pergunta').value;
  document.getElementById('visualizar_pergunta').value = texto;
  document.getElementById('checks').style.display = 'block';
}

//Pegar as perguntas da tabela e colocar no Select INPUT
function listar_perguntas(){
  axios.post(`${ip}listar_perguntas`, {
    usuario: sessionStorage.usuario,
    senha: sessionStorage.senha
  }).then(function (response) {
    if(response.data.error == 'sim' || response.data.error == true){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Parece que você não tem permissão para isso'
      });
    }else{
      perguntas = '<option disabled selected>Selecione a pergunta</option>';
      //console.log(response.data.resposta);
      response.data.resposta.map((item, index)=>{
        perguntas = perguntas + `<option value="${item.pergunta}">${item.topico}</option>`
    });
    document.getElementById('selecionar_pergunta').innerHTML = perguntas;
      
    }
  })
  .catch(function (error) {
    console.log(error);
  });
}

// Exibir lista de clientes no TEXTArea
function exibir_clientes(clientes){
  let cli = "";
  clientes.map((item, index)=>{
    cli = cli + `${item.nome_cliente}, ${item.celular}\n`;
  });

  document.getElementById('visualizar_clientes').value = cli;
}

// 1
function Enviar(){
  confirmar_enviar(clientes_com_zap_validos.length);
}

//2
function confirmar_enviar(qtd){
  Swal.fire({
    title: `${sessionStorage.usuario}, tem certeza?`,
    text: `Deseja enviar esta pesquisa para ${qtd} clientes?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sim, Desejo!',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      document.getElementById('total_label').innerHTML = `Total: ${qtd}`;
      $('#progress_total').css('width', '100%').attr('aria-valuenow', 100).html('100%');
      $('#progress_parcial').css('width', '0%').attr('aria-valuenow', 0).html('0%');
      chamar();
    }
  })
}

//3
async function chamar(){
  await gravar_pesquisas_enviadas().then((res)=>{
    console.log(res.data.msg);
  }).catch((erro)=>{
      console.log(erro);
  });

  await pegar_ultima_pesquisa().then((res)=>{
      console.log("Pesquisa número: ",res.data.resposta[0].id);
      id_pesq = res.data.resposta[0].id;
  }).catch((erro)=>{
      console.log("Entrou no catch ",erro);
      id_pesq = 0;
  });

  await getTodos();
}

//4
function gravar_pesquisas_enviadas(){
  let pergunta = document.getElementById('visualizar_pergunta').value;
  let topico = $('#selecionar_pergunta :selected').text();

  return new Promise((resolve,reject)=>{
    axios.post(`${ip}cadastrar_pesquisas`, {
      usuario: sessionStorage.usuario,
      senha: sessionStorage.senha,
      topico: topico,
      pergunta: pergunta,
      perfis: "Personalizada"
    }).then( function (response) { resolve(response);
    }).catch(function (error)    { reject(error); });
  });
}

//5
function pegar_ultima_pesquisa(){
  let sql = "SELECT MAX(id) AS id FROM pesquisas_enviadas;";
  return new Promise((resolve,reject)=>{
    axios.post(`${ip}listar_clientes`, {
      usuario: sessionStorage.usuario,
      senha: sessionStorage.senha,
      sql: sql
    }).then( function (response) { resolve(response);
    }).catch(function (error)    { reject(error); });
  });

}

//6
async function getTodos() {
  for (const [index, cliente] of clientes_com_zap_validos.entries()) {
      const num_existe = await verificar_se_numero_existe(cliente.celular);
      console.log(num_existe);
      //const resposta = await enviando_pesquisa(cliente);
      //console.log(`${index+1} Enviados: `, resposta.data.msg, " - ", cliente);
      //let parcial = parseInt((100 * (index+1)) / num_pesquisas);
      //$('#progress_parcial').css('width', parcial+'%').attr('aria-valuenow', parcial).html(`${parcial}%`);
  }

  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: 'Envio Finalizado!',
    showConfirmButton: false,
    timer: 2500
  });
  setTimeout(function() {
    location.replace("lista.html");
  }, 3000);

}

//7
function verificar_se_numero_existe(cel){
  const formatado = cel.replace(/\D+/g, "");
  return new Promise((resolve,reject)=>{
    axios.post(`${ip}existe_numero`, {
      usuario: sessionStorage.usuario,
      senha: sessionStorage.senha,
      numero: formatado
    }).then( function (response) { resolve(response);
    }).catch(function (error)    { reject(error); });
  });
}

//8
function enviando_pesquisa(item){
  let perg = document.getElementById('visualizar_pergunta').value;
  const formatado = item.cel.replace(/\D+/g, "");
  return new Promise((resolve,reject)=>{
    axios.post(`${ip}enviar`, {
      usuario: sessionStorage.usuario,
      senha: sessionStorage.senha,
      id_pesquisa: id_pesq,
      nome: item.nome,
      perfil: item.perfil,
      numero: formatado,
      pergunta: perg
    }).then( function (response) { resolve(response);
    }).catch(function (error)    { reject(error); });
  });
}

if(login != 'OK'){
    document.getElementById('msg').innerHTML = "Acesso não autorizado";
    setTimeout(function() {
      location.replace("index.html");
    }, 500);
}else{
  listar_perguntas();
}