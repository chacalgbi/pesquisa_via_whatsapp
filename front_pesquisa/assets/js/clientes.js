var login = sessionStorage.login;
const ip = sessionStorage.ip;

$(document).ready( function () {
  listar_perfis();
  iniciar();
} );

$('#editarModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget);
  var id = button.data('id');
  var nome = button.data('nome');
  var cod_cli = button.data('cod_cli');
  var perfil = button.data('perfil');
  var cidade = button.data('cidade');
  var celular = button.data('celular');
  var email = button.data('email');
  var zap_valido = button.data('zap_valido');
  var aceita_pesquisa = button.data('aceita_pesquisa');
  var modal = $(this);

  modal.find('#editar_id').html(id);
  modal.find('#editar_nome').val(nome);
  modal.find('#editar_cod_cli').val(cod_cli);
  modal.find('#editar_perfil').val(perfil);
  modal.find('#editar_cidade').val(cidade);
  modal.find('#editar_celular').val(celular);
  modal.find('#editar_email').val(email);
  modal.find('#editar_zap_valido').val(zap_valido);
  modal.find('#editar_aceita_pesquisa').val(aceita_pesquisa);
})

function sair(){
    sessionStorage.login = 'NOT';
    sessionStorage.ip = '...';
    sessionStorage.usuario = "...";
    sessionStorage.senha = "...";
    location.replace("index.html");
}

function cadastrar(){
  const topico = document.getElementById("cadastrar_topico").value;
  const pergunta = document.getElementById("cadastrar_msg").value;

  if(topico.length < 5 || pergunta.length < 15){
    Swal.fire(
      'Aviso',
      'Preencha todos os campos corretamente',
      'warning'
    );
  }else{
    axios.post(`${ip}cadastrar_pergunta`, {
      usuario: sessionStorage.usuario,
      senha: sessionStorage.senha,
      topico: topico,
      pergunta: pergunta
    }).then(function (response) {
        console.log(response.data);
        if(response.data.error == 'sim' || response.data.error == true){
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Algo deu errado',
            footer: '<a href="perguntas.html">Voltar para a lista de perguntas</a>'
          });
        }else{
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Cadastrado com sucesso',
            showConfirmButton: false,
            timer: 1500
          });
          setTimeout(function() {
            location.replace("perguntas.html");
          }, 1600);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

 
}

function editar(){
  const editar_id = document.getElementById("editar_id").innerHTML;
  const editar_nome = document.getElementById("editar_nome").value;
  const editar_cod_cli = document.getElementById("editar_cod_cli").value;
  const editar_perfil = document.getElementById("editar_perfil").value;
  const editar_cidade = document.getElementById("editar_cidade").value;
  const editar_celular = document.getElementById("editar_celular").value;
  const editar_email = document.getElementById("editar_email").value;
  const editar_zap_valido = document.getElementById("editar_zap_valido").value;
  const editar_aceita_pesquisa = document.getElementById("editar_aceita_pesquisa").value;

  console.log("editar_id: ", editar_id);

  if(editar_nome.length < 5){
    Swal.fire(
      'Aviso',
      'Preencha todos os campos corretamente',
      'warning'
    );
  }else{
    axios.post(`${ip}editar_cliente`, {
      usuario: sessionStorage.usuario,
      senha: sessionStorage.senha,
      id: editar_id,
      nome: editar_nome,
      cod_cliente: editar_cod_cli,
      perfil: editar_perfil,
      cidade: editar_cidade,
      cel: editar_celular,
      email: editar_email,
      zap_valido: editar_zap_valido,
      aceita_pesquisa: editar_aceita_pesquisa
    }).then(function (response) {
        console.log(response.data);
        if(response.data.error == 'sim' || response.data.error == true){
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Algo deu errado',
            footer: '<a href="clientes.html">Voltar para a lista de Clientes</a>'
          });
        }else{
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Modificado com sucesso',
            showConfirmButton: false,
            timer: 1500
          });
          setTimeout(function() {
            location.replace("clientes.html");
          }, 1600);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

 
}

function apagar(id){
  Swal.fire({
    title: 'Deseja apagar esse registro?',
    text: "Esta ação não pode ser desfeita!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'SIM, quero apagar!',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      axios.post(`${ip}deletar_cliente`, {
        usuario: sessionStorage.usuario,
        senha: sessionStorage.senha,
        id: id
      }).then(function (response) {
        if(response.data.error == 'sim' || response.data.error == true){
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Parece que algo deu errado.'
          });
        }else{
          //console.log(response.data);
          Swal.fire('Deletado!', 'O registro foi apagado.', 'success');
          setTimeout(function(){ location.replace("clientes.html"); }, 1500);
        }
      })
      .catch(function (error) {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Parece que algo deu errado ao acessar o Banco de Dados.'
        });
      });
      

    }
  })
}

function iniciar(){
  if(login != 'OK'){
    document.getElementById('msg').innerHTML = "Acesso não autorizado";
    setTimeout(function() {
      location.replace("index.html");
    }, 500);
  }else{
      const ip = sessionStorage.ip;
      //console.log(ip);
      const sql = "SELECT * FROM clientes";
      axios.post(`${ip}listar_clientes`, {
        usuario: sessionStorage.usuario,
        senha: sessionStorage.senha,
        sql: sql
      }).then(function (response) {
        if(response.data.error == 'sim' || response.data.error == true){
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Parece que você não tem permissão para isso'
          });
        }else{;
          var table = "";
          for (let index = 0; index < response.data.resposta.length; index++){
            table = table + `<tr>
            <td>${index + 1}</td>
            <td>${response.data.resposta[index].nome}</td>
            <td>${response.data.resposta[index].cod_cliente}</td>
            <td>${response.data.resposta[index].perfil}</td>
            <td>${response.data.resposta[index].cidade}</td>
            <td>${response.data.resposta[index].cel}</td>
            <td>${response.data.resposta[index].zap_valido}</td>
            <td>${response.data.resposta[index].aceita_pesquisa}</td>
            <td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#editarModal" 
            data-id="${response.data.resposta[index].id}" 
            data-nome="${response.data.resposta[index].nome}" 
            data-cod_cli="${response.data.resposta[index].cod_cliente}"
            data-perfil="${response.data.resposta[index].perfil}" 
            data-cidade="${response.data.resposta[index].cidade}"
            data-celular="${response.data.resposta[index].cel}"
            data-email="${response.data.resposta[index].email}" 
            data-zap_valido="${response.data.resposta[index].zap_valido}"
            data-aceita_pesquisa="${response.data.resposta[index].aceita_pesquisa}"
            >Editar</button></td>
            <td><button class="btn btn-danger" onclick="apagar(${response.data.resposta[index].id})">Apagar</button></td>
            </tr>`
          }
          document.getElementById('corpo').innerHTML = table;
          document.getElementById('qtd_clientes').innerHTML = `${response.data.resposta.length} Registros encontrados.`;
          $('#tabela2').DataTable();
        }
      })
      .catch(function (error) {
        console.log(error);
      });

  }
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
      perfis = '<option disabled selected>Selecione um filtro</option>';
      perfis = perfis + `<option value="SELECT * FROM clientes WHERE zap_valido='nao';">WhastsApp Inválidos</option>`;
      perfis = perfis + `<option value="SELECT * FROM clientes WHERE aceita_pesquisa='nao';">Não querem receber pesquisa</option>`;
      perfis = perfis + `<option value="SELECT * FROM clientes c WHERE CHAR_LENGTH(c.cel) < 9;">Números de Celular Inválidos</option>`;
      //console.log(response.data.resposta);
      response.data.resposta.map((item, index)=>{
        perfis = perfis + `<option value="SELECT * FROM clientes WHERE perfil='${item.perfil}';"> Filtrar por perfil ${item.perfil}</option>`
    });
    document.getElementById('selecionar_listagem').innerHTML = perfis;
      
    }
  })
  .catch(function (error) {
    console.log(error);
  });
}

function listar_por(item){
  //console.log(item.value);
  axios.post(`${ip}listar_clientes`, {
    usuario: sessionStorage.usuario,
    senha: sessionStorage.senha,
    sql: item.value
  }).then(function (response) {
    if(response.data.error == 'sim' || response.data.error == true){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Parece que você não tem permissão para isso'
      });
    }else{
      var table = "";
      document.getElementById('corpo').innerHTML = table;
      for (let index = 0; index < response.data.resposta.length; index++){
        table = table + `<tr>
        <td>${index + 1}</td>
        <td>${response.data.resposta[index].nome}</td>
        <td>${response.data.resposta[index].cod_cliente}</td>
        <td>${response.data.resposta[index].perfil}</td>
        <td>${response.data.resposta[index].cidade}</td>
        <td>${response.data.resposta[index].cel}</td>
        <td>${response.data.resposta[index].zap_valido}</td>
        <td>${response.data.resposta[index].aceita_pesquisa}</td>
        <td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#editarModal" 
            data-id="${response.data.resposta[index].id}" 
            data-nome="${response.data.resposta[index].nome}" 
            data-cod_cli="${response.data.resposta[index].cod_cliente}"
            data-perfil="${response.data.resposta[index].perfil}" 
            data-cidade="${response.data.resposta[index].cidade}"
            data-celular="${response.data.resposta[index].cel}"
            data-email="${response.data.resposta[index].email}" 
            data-zap_valido="${response.data.resposta[index].zap_valido}"
            data-aceita_pesquisa="${response.data.resposta[index].aceita_pesquisa}"
            >Editar</button></td>
        <td><button class="btn btn-danger" onclick="apagar(${response.data.resposta[index].id})">Apagar</button></td>
        </tr>`
      }
      document.getElementById('corpo').innerHTML = table;
      document.getElementById('qtd_clientes').innerHTML = `${response.data.resposta.length} Registros encontrados.`;
      $('#tabela2').DataTable();
    }
  })
  .catch(function (error) {
    console.log(error);
  });
}