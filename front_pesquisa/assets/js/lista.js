var login = sessionStorage.login;
const ip = sessionStorage.ip;

$("#header").load("menu.html");

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
    const ip = sessionStorage.ip;

    axios.post(`${ip}listar_pesquisas`, {
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
          <td>${response.data.resposta[index].usuario}</td>
          <td>${response.data.resposta[index].perfis}</td>
          </tr>`
        }
        document.getElementById('corpo').innerHTML = table;
        $('#tabela').DataTable();
      }
    })
    .catch(function (error) {
      console.log(error);
    });

}