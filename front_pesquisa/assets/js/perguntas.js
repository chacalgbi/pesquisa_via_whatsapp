var login = sessionStorage.login;
const ip = sessionStorage.ip;

$('#editarModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget);
  var id = button.data('id');
  var topico = button.data('topico');
  var pergunta = button.data('pergunta');
  var modal = $(this);
  modal.find('#editar_topico').val(topico);
  modal.find('#editar_pergunta').val(pergunta);
  modal.find('#editar_id').html(id);
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
  const topico = document.getElementById("editar_topico").value;
  const pergunta = document.getElementById("editar_pergunta").value;
  const id = document.getElementById("editar_id").innerHTML;

  console.log(topico);
  console.log(pergunta);
  console.log(id);

  if(topico.length < 5 || pergunta.length < 15){
    Swal.fire(
      'Aviso',
      'Preencha todos os campos corretamente',
      'warning'
    );
  }else{
    axios.post(`${ip}editar_pergunta`, {
      usuario: sessionStorage.usuario,
      senha: sessionStorage.senha,
      id: id,
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
            title: 'Modificado com sucesso',
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
      axios.post(`${ip}deletar_pergunta`, {
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
          console.log(response.data);
          Swal.fire('Deletado!', 'O registro foi apagado.', 'success');
          setTimeout(function(){ location.replace("perguntas.html"); }, 1500);
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

if(login != 'OK'){
    document.getElementById('msg').innerHTML = "Acesso não autorizado";
    setTimeout(function() {
      location.replace("index.html");
    }, 500);
}else{
    const ip = sessionStorage.ip;
    //console.log(ip);

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
        //console.log(response.data.resposta);
        var table = "";
        for (let index = 0; index < response.data.resposta.length; index++){
          table = table + `<tr>
          <td>${index + 1}</td>
          <td>${response.data.resposta[index].topico}</td>
          <td>${response.data.resposta[index].pergunta}</td>
          <td>${response.data.resposta[index].data_hora}</td>
          <td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#editarModal" data-id="${response.data.resposta[index].id}" data-topico="${response.data.resposta[index].topico}" data-pergunta="${response.data.resposta[index].pergunta}">Editar</button></td>
          <td><button class="btn btn-danger" onclick="apagar(${response.data.resposta[index].id})">Apagar</button></td>
          </tr>`
        }
        document.getElementById('corpo').innerHTML = table;
      }
    })
    .catch(function (error) {
      console.log(error);
    });

}