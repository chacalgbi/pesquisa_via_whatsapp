var login = sessionStorage.login;
const ip = sessionStorage.ip;
var perguntas = '';
var perfis = '';
var num_pesquisas = 0;
var total = 100;
var enviados = 50;
var listaClientes = [];

function sair(){
  sessionStorage.login = 'NOT';
  sessionStorage.ip = '...';
  sessionStorage.usuario = "...";
  sessionStorage.senha = "...";
  location.replace("index.html");
}

function inserir_pergunta(){
  let texto = document.getElementById('selecionar_pergunta').value;
  document.getElementById('visualizar_pergunta').value = texto;
  document.getElementById('checks').style.display = 'block';
}

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

function listar_perfis(){
  axios.post(`${ip}pegar_perfis`, {
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
      perfis = '<div class="form-check"><input class="form-check-input" onclick="marcar_todos()" type="checkbox" value="Todos" id="Todos">Todos</div>';
      //console.log(response.data.resposta);
      response.data.resposta.map((item, index)=>{
        perfis = perfis + `<div class="form-check"><input class="form-check-input" type="checkbox" value="${item.perfil}" id="${item.perfil}">${item.perfil}</div>`
    });
    document.getElementById('checks').innerHTML = perfis;
      
    }
  })
  .catch(function (error) {
    console.log(error);
  });
}

function selecionar_perfis(){
  var perfis = "";
  
  if(document.getElementById("Todos").checked){
    perfis = "Todos";
    return perfis;
  }else{
    var minhaDiv = document.getElementById("checks");
    var listaMarcados = minhaDiv.getElementsByTagName("input");
    for (loop = 0; loop < listaMarcados.length; loop++) {
      var item = listaMarcados[loop];
      if (item.type == "checkbox" && item.checked) {
        perfis = perfis + `'${item.id}',`;
      }
    }
    const str2 = perfis.slice(0, -1);
    return str2;
  }

}

async function chamar(){
  await getTodos();
}

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

function enviando_pesquisa(item){
  let perg = document.getElementById('visualizar_pergunta').value;
  const formatado = item.cel.replace(/\D+/g, "");
  return new Promise((resolve,reject)=>{
    axios.post(`${ip}enviar`, {
      usuario: sessionStorage.usuario,
      senha: sessionStorage.senha,
      nome: item.nome,
      perfil: item.perfil,
      numero: formatado,
      pergunta: perg
    }).then( function (response) { resolve(response);
    }).catch(function (error)    { reject(error); });
  });

}

async function getTodos() {
  for (const [index, cliente] of listaClientes.entries()) {
      const resposta = await enviando_pesquisa(cliente);
      console.log(`${index+1} Enviados: `, resposta.data.msg, " - ", cliente);
      let parcial = parseInt((100 * (index+1)) / num_pesquisas);
      $('#progress_parcial').css('width', parcial+'%').attr('aria-valuenow', parcial).html(`${parcial}%`);
  }
}

function exibir_clientes(clientes){
  let cli = "";
  clientes.map((item, index)=>{
    cli = cli + `${item.nome}, ${item.cel}, ${item.perfil}\n`;
  });

  document.getElementById('visualizar_clientes').value = cli;
}

function Enviar(){
  let qtd_perfis = selecionar_perfis();
  let resultado = '';
  if(qtd_perfis == ''){
    Swal.fire({
      icon: 'info',
      title: 'Oops...',
      text: 'É necessário selecionar algum perfil!'
    });
  }else if(qtd_perfis == 'Todos'){
    resultado = `${ip}todos_perfis`;
    axios.post(resultado, {
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
        num_pesquisas = response.data.resposta.length;
        listaClientes = response.data.resposta;
        exibir_clientes(response.data.resposta);
        console.log(response.data.resposta);
        confirmar_enviar(num_pesquisas);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }else{
    resultado = `${ip}perfis_selecionados`;
    axios.post(resultado, {
      usuario: sessionStorage.usuario,
      senha: sessionStorage.senha,
      perfis: qtd_perfis
    }).then(function (response) {
      if(response.data.error == 'sim' || response.data.error == true){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Parece que você não tem permissão para isso'
        });
      }else{
        num_pesquisas = response.data.resposta.length;
        exibir_clientes(response.data.resposta);
        listaClientes = response.data.resposta;
        console.log(response.data.resposta);
        confirmar_enviar(num_pesquisas);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

}

function marcar_todos(){
  var marcado = false;
  var todos = document.getElementById("Todos");
  marcado = todos.checked;
  var minhaDiv = document.getElementById("checks");
  var listaMarcados = minhaDiv.getElementsByTagName("input");

  for (loop = 0; loop < listaMarcados.length; loop++){
    var item = listaMarcados[loop];
    item.checked = marcado;
  }

}

if(login != 'OK'){
    document.getElementById('msg').innerHTML = "Acesso não autorizado";
    setTimeout(function() {
      location.replace("index.html");
    }, 500);
}else{
  listar_perguntas();
  listar_perfis();
}