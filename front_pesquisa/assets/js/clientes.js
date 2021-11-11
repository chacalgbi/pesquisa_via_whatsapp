var login = sessionStorage.login;
const ip = sessionStorage.ip;

$(document).ready( function ($){
  listar_perfis();
  iniciar();
  listar_perfis_cadastrar();
  $('#cadastrar_celular').mask('(00) 00000-0000');
});

$('#editarModal').on('show.bs.modal', function (event) {
  document.getElementById('foto_cliente').src = "no_image.jpg";
  document.getElementById('link_cliente').href = "https://www.google.com.br/";

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
  modal.find('#editar_celular').val(celular);
  modal.find('#editar_email').val(email);

  listar_perfis1(perfil); //modal.find('#editar_perfil').val(perfil); // está sendo inserido na função listar_perfis

  let cidade1 = `<option value="${cidade}">${cidade}</option>
                <option value="Guanambi">Guanambi</option>
                <option value="Bom Jesus da Lapa">Bom Jesus da Lapa</option>
                <option value="Pindai">Pindai</option>
                <option value="Candiba">Candiba</option>`;
  document.getElementById('editar_cidade').innerHTML = cidade1;

  let zap = `<option selected value="${zap_valido}">${zap_valido}</option>
             <option value="sim">sim</option>
             <option value="nao">nao</option>`;
  document.getElementById('editar_zap_valido').innerHTML = zap;

  let pes = `<option selected value="${aceita_pesquisa}">${aceita_pesquisa}</option>
             <option value="sim">sim</option>
             <option value="nao">nao</option>`;
  document.getElementById('editar_aceita_pesquisa').innerHTML = pes;

  fotoCliente(celular);
})

function sair(){
    sessionStorage.login = 'NOT';
    sessionStorage.ip = '...';
    sessionStorage.usuario = "...";
    sessionStorage.senha = "...";
    location.replace("index.html");
}

function cadastrar(){
  const nome = document.getElementById("cadastrar_nome").value;
  const cod_cliente = document.getElementById("cadastrar_cod_cli").value;
  const perfil = document.getElementById("cadastrar_perfil").value;
  const cidade = document.getElementById("cadastrar_cidade").value;
  const cel = document.getElementById("cadastrar_celular").value;
  const email = document.getElementById("cadastrar_email").value;
  const zap_valido = document.getElementById("cadastrar_zap_valido").value;
  const aceita_pesquisa = document.getElementById("cadastrar_aceita_pesquisa").value;

  if(nome.length < 4){
    Swal.fire(
      'Aviso',
      'Preencha todos os campos corretamente',
      'warning'
    );
  }else{
    axios.post(`${ip}cadastrar_cliente`, {
      usuario: sessionStorage.usuario,
      senha: sessionStorage.senha,
      nome: nome,
      cod_cliente: cod_cliente,
      perfil: perfil,
      cidade: cidade,
      cel: cel,
      email: email,
      zap_valido: zap_valido,
      aceita_pesquisa: aceita_pesquisa
    }).then(function (response) {
        console.log(response.data);
        if(response.data.error == 'sim' || response.data.error == true){
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Algo deu errado',
            footer: '<a href="clientes.html">Voltar para a lista de clientes</a>'
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
            location.replace("clientes.html");
          }, 1600);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}

function validarWhatsAppEdit(item){
  const formatado = item.replace(/\D+/g, "");
  axios.post(`${ip}existe`, {
    usuario: sessionStorage.usuario,
    senha: sessionStorage.senha,
    numero: formatado
  }).then(function (response) {
    if(response.data.pode_receber_mensagens){
      $("#editar_celular").notify(
        `Este número: ${item}, é um WhatsApp VÁLIDO!`,
        { 
          className: 'success',
          position:"top center",
          arrowShow: true,
          arrowSize: 15
        }
      );
    }
    else{
      $("#editar_celular").notify(
        `Este número: ${item}, é um WhatsApp INVÁLIDO!`,
        { 
          className: 'error',
          position:"top center",
          arrowShow: true,
          arrowSize: 15
        }
      );
    }

  })
  .catch(function (error) {
    $("#editar_celular").notify(
      `NÃO FOI POSSÍVEL FAZER A VERIFICAÇÃO DO NÚMERO`,
      { 
        className: 'error',
        position:"top center",
        arrowShow: true,
        arrowSize: 15
      }
    );
  });
}

function validarWhatsApp(item){
  const formatado = item.replace(/\D+/g, "");
  axios.post(`${ip}existe`, {
    usuario: sessionStorage.usuario,
    senha: sessionStorage.senha,
    numero: formatado
  }).then(function (response) {
    if(response.data.pode_receber_mensagens){
      $("#cadastrar_celular").notify(
        `Este número: ${item}, é um WhatsApp VÁLIDO!`,
        { 
          className: 'success',
          position:"top center",
          arrowShow: true,
          arrowSize: 15
        }
      );
    }
    else{
      $("#cadastrar_celular").notify(
        `Este número: ${item}, é um WhatsApp INVÁLIDO!`,
        { 
          className: 'error',
          position:"top center",
          arrowShow: true,
          arrowSize: 15
        }
      );
    }

  })
  .catch(function (error) {
    $("#cadastrar_celular").notify(
      `NÃO FOI POSSÍVEL FAZER A VERIFICAÇÃO DO NÚMERO`,
      { 
        className: 'error',
        position:"top center",
        arrowShow: true,
        arrowSize: 15
      }
    );
  });
}

function fotoCliente(item){
  const formatado = item.replace(/\D+/g, "");
  axios.post(`${ip}profile`, {
    usuario: sessionStorage.usuario,
    senha: sessionStorage.senha,
    numero: formatado
  }).then(function (response) {
    if(response.data.foto){
      //console.log(response.data.foto);
      document.getElementById('foto_cliente').src = response.data.foto;
      document.getElementById('link_cliente').href = response.data.foto;
    }
  })
  .catch(function (error) {
    $("#foto_cliente").notify(
      `NÃO FOI POSSÍVEL RECUPERAR A FOTO.`,
      { 
        className: 'error',
        position:"top center",
        arrowShow: true,
        arrowSize: 15
      }
    );
  });
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
        }else{
          var table = "";
          let cor = "";
          for (let index = 0; index < response.data.resposta.length; index++){
            if(response.data.resposta[index].zap_valido == 'nao'){cor= 'table-danger';}else{cor="table-light";}
            table = table + `<tr class="${cor}">
            <td>${index + 1}</td>
            <td>${response.data.resposta[index].nome}</td>
            <td>${response.data.resposta[index].cod_cliente}</td>
            <td>${response.data.resposta[index].perfil}</td>
            <td>${response.data.resposta[index].campanha}</td>
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
            title="Editar Cliente"><i class='bx bx-edit-alt'></i></button></td>
            <td><button class="btn btn-danger" title="Apagar Registro" onclick="apagar(${response.data.resposta[index].id})"><i class='bx bx-message-square-x'></i></button></td>
            </tr>`
          }
          document.getElementById('corpo').innerHTML = table;
          document.getElementById('qtd_clientes').innerHTML = `${response.data.resposta.length} Registros encontrados.`;
          //$('#tabela2').DataTable();
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
        perfis = perfis + `<option value="SELECT * FROM clientes WHERE perfil='${item.perfil}';">${item.perfil}</option>`
    });
    document.getElementById('selecionar_listagem').innerHTML = perfis;
      
    }
  })
  .catch(function (error) {
    console.log(error);
  });
}

function listar_por(item){
  document.getElementById('corpo').innerHTML = "";
  //$('#tabela2').DataTable();
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
      let contagem = 0;
      let cor = "";
      document.getElementById('corpo').innerHTML = table;
      for (let index = 0; index < response.data.resposta.length; index++){
        if($("#zap_nulo").is(':checked') && response.data.resposta[index].zap_valido === 'sim'){
          continue;
        }
        if(response.data.resposta[index].zap_valido == 'nao'){cor= 'table-danger';}else{cor="table-light";}
        contagem++;
        table = table + `<tr class="${cor}">
        <td>${index + 1}</td>
        <td>${response.data.resposta[index].nome}</td>
        <td>${response.data.resposta[index].cod_cliente}</td>
        <td>${response.data.resposta[index].perfil}</td>
        <td>${response.data.resposta[index].campanha}</td>
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
            title="Editar Cliente"><i class='bx bx-edit-alt'></i></button></td>
        <td><button class="btn btn-danger" title="Apagar Registro" onclick="apagar(${response.data.resposta[index].id})"><i class='bx bx-message-square-x'></i></button></td>
        </tr>`
      }
      document.getElementById('corpo').innerHTML = table;
      document.getElementById('qtd_clientes').innerHTML = `${contagem} Registros encontrados.`;
      //$('#tabela2').DataTable();
    }
  })
  .catch(function (error) {
    console.log(error);
  });
}

function listar_perfis_cadastrar(){
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
      let perfis2 = '<option disabled selected>Selecione um perfil</option>';
      response.data.resposta.map((item, index)=>{
        perfis2 = perfis2 + `<option value="${item.perfil}">${item.perfil}</option>`
      });
    document.getElementById('cadastrar_perfil').innerHTML = perfis2;
      
    }
  })
  .catch(function (error) {
    console.log(error);
  });
}

function listar_perfis1(perfil){
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
      perfis = `<option selected value="${perfil}">${perfil}</option>`;
      //console.log(response.data.resposta);
      response.data.resposta.map((item, index)=>{
        perfis = perfis + `<option value="${item.perfil}">${item.perfil}</option>`
    });
    document.getElementById('editar_perfil').innerHTML = perfis;
      
    }
  })
  .catch(function (error) {
    console.log(error);
  });
}