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
var data_inicio = '';
var data_fim = '';
var envio_sucesso = 0;
var envio_erro = 0;

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
  document.getElementById('dias').style.display = 'block';
}

function mostrar_checks(){
  document.getElementById('checks').style.display = 'block';
  document.getElementById('checks1').style.display = 'block';
  dias = document.getElementById('selecionar_dias').value;
}

function pegar_datas(){
  data_inicio = document.getElementById('data_inicio').value;
  data_fim = document.getElementById('data_fim').value;
  console.log("Inicio: ", data_inicio);
  console.log("Fim: ", data_fim);
  if(data_inicio == '' || data_fim == ''){
    Swal.fire({
      icon: 'info',
      title: 'Oops...',
      text: 'É necessário selecionar as datas!'
    });
  }
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

//1
function Enviar(){
  if(data_inicio == '' || data_fim == ''){
    Swal.fire({
      icon: 'info',
      title: 'Oops...',
      text: 'É necessário selecionar as datas!'
    });
  }else{
    resultado = `${ip}datas`;
    axios.post(resultado, {
      usuario: sessionStorage.usuario,
      senha: sessionStorage.senha,
      inicio: data_inicio,
      fim: data_fim,
      dias: dias
    }).then(function (response) {
      if(response.data.error == 'sim' || response.data.error == true){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Parece que você não tem permissão para isso'
        });
      }else{
        num_pesquisas = response.data.resposta.length;
        if(num_pesquisas == 0){
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Nenhum cliente atende aos critérios.'
          });
        }else{
          exibir_clientes(response.data.resposta);
          listaClientes = response.data.resposta;
          console.log(response.data.resposta);
          confirmar_enviar(num_pesquisas);
        }
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

}

//2
function exibir_clientes(clientes){
  let cli = "";
  clientes.map((item, index)=>{
    cli = cli + `${item.nome}, ${item.cel}, ${item.perfil}\n`;
  });

  document.getElementById('visualizar_clientes').value = cli;
}

//3
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

//4
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

//5
function gravar_pesquisas_enviadas(){
  let pergunta = document.getElementById('visualizar_pergunta').value;
  let topico = $('#selecionar_pergunta :selected').text();

  return new Promise((resolve,reject)=>{
    axios.post(`${ip}cadastrar_pesquisas`, {
      usuario: sessionStorage.usuario,
      senha: sessionStorage.senha,
      topico: topico,
      pergunta: pergunta,
      perfis: perfis
    }).then( function (response) { resolve(response);
    }).catch(function (error)    { reject(error); });
  });
}

//6
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

function tempo_entre_envios(){
  return new Promise((resolve, reject)=>{
      setTimeout(()=>{ 
              resolve("OK");
      }, 10000);
  });
}

//7
async function getTodos() {
  for (const [index, cliente] of listaClientes.entries()) {
      const resposta = await enviando_pesquisa(cliente);
      console.log(`${index+1} Enviado: `, cliente);
      let parcial = parseInt((100 * (index+1)) / num_pesquisas);
      $('#progress_parcial').css('width', parcial+'%').attr('aria-valuenow', parcial).html(`${parcial}%`);
      await tempo_entre_envios(); // Aguardar 10 segundos!
  }

  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: `Envio Finalizado! ${envio_sucesso} envios com sucesso e ${envio_erro} erros`,
    showConfirmButton: false,
    timer: 6000
  });

  setTimeout(function() {
    location.replace("lista.html");
  }, 6500);

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
      }).then( function (response) { envio_sucesso++; resolve(response);
      }).catch(function (error)    { envio_erro++; reject(error); });
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