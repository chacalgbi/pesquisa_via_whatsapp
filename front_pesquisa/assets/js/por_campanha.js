var login = sessionStorage.login;
const ip = sessionStorage.ip;
var perguntas = '';
var perfis = '';
var num_pesquisas = 0;
var total = 100;
var enviados = 50;
var listaClientes = [];
var id_pesq = 0;
var dias = 0;

// 1 - Na inicialização, Pegar as perguntas da tabela e colocar no Select INPUT
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

// 2 - Na inicialização, carrega a lista de campanhas
function listar_campanhas(){
  axios.post(`${ip}listar_clientes`, {
    usuario: sessionStorage.usuario,
    senha: sessionStorage.senha,
    sql: "SELECT campanha FROM clientes WHERE campanha IS NOT NULL GROUP BY campanha;"
  }).then(function (response) {
    if(response.data.error == 'sim' || response.data.error == true){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Parece que você não tem permissão para isso'
      });
    }else{
      console.log(response.data.resposta);
      perfis = "<form>";
      response.data.resposta.map((item, index)=>{
        perfis = perfis + `<div class="form-check"><input class="form-check-input" type="radio" name="camp" value="${item.campanha}" id="${item.campanha}">${item.campanha}</div>`
      });
      perfis = perfis + "</form><br/><button type='submit' onclick='buscar_clientes_campanha()' class='btn btn-info'>Buscar Clientes</button>";
      document.getElementById('checks').innerHTML = perfis;
    }
  })
  .catch(function (error) {
    console.log(error);
  });
}

// 3 - Insere a pergunta selecionada na caixa de texto
function inserir_pergunta(){
  let texto = document.getElementById('selecionar_pergunta').value;
  document.getElementById('visualizar_pergunta').value = texto;
  document.getElementById('dias').style.display = 'block';
}

// 4 - Mostra a lista de campanhas
function mostrar_checks(){
  document.getElementById('checks').style.display = 'block';
  document.getElementById('checks1').style.display = 'block';
  dias = document.getElementById('selecionar_dias').value;
  console.log(dias);
}

// 5 - Busca os clientes baseado na campanha selecionada e fora do tempo de ultima_pesquisa
function buscar_clientes_campanha(){
  let marcado = document.querySelector('input[name=camp]:checked').value;
  axios.post(`${ip}listar_clientes`, {
    usuario: sessionStorage.usuario,
    senha: sessionStorage.senha,
    sql: `SELECT * FROM clientes WHERE campanha ='${marcado}' AND (DATEDIFF(NOW(),ultima_pesquisa) > ${dias} OR ultima_pesquisa IS NULL);`
  }).then(function (response) {
    if(response.data.error == 'sim' || response.data.error == true){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Parece que você não tem permissão para isso'
      });
    }else{
      console.log(response.data.resposta);
      listaClientes = response.data.resposta;
      let cli = '';
      response.data.resposta.map((item, index)=>{
        cli = cli + `${index+1} - ${item.nome} - ${item.cel}\n`;
      });
      document.getElementById('visualizar_clientes').value = cli;
    }
  })
  .catch(function (error) {
    console.log(error);
  });
}

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

function sair(){
  sessionStorage.login = 'NOT';
  sessionStorage.ip = '...';
  sessionStorage.usuario = "...";
  sessionStorage.senha = "...";
  location.replace("index.html");
}

// 1
function Enviar(){
  confirmar_enviar(listaClientes.length);
}

//2
function confirmar_enviar(qtd){
  num_pesquisas = qtd;
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
  for (const [index, cliente] of listaClientes.entries()) {
      const num_existe = await verificar_se_numero_existe(cliente.cel);
      console.log(num_existe.data);
      const resposta = await enviando_pesquisa(cliente);
      console.log(`${index+1} Enviados: `, resposta.data.msg, " - ", cliente);
      let parcial = parseInt((100 * (index+1)) / num_pesquisas);
      $('#progress_parcial').css('width', parcial+'%').attr('aria-valuenow', parcial).html(`${parcial}%`);
  }

  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: 'Envio Finalizado!',
    showConfirmButton: false,
    timer: 4000
  });

  //setTimeout(function() { location.replace("lista.html"); }, 5000);

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
  listar_campanhas();
}