var login = sessionStorage.login;
const ip = sessionStorage.ip;

function sair(){
  sessionStorage.login = 'NOT';
  sessionStorage.ip = '...';
  sessionStorage.usuario = "...";
  sessionStorage.senha = "...";
  location.replace("index.html");
}

function pesquisas_feitas_no_dia(){
  let sql = "SELECT COUNT(*) AS total FROM resultado_chat WHERE DATE(hora_resp) = CURRENT_DATE();";
  axios.post(`${ip}listar_clientes`, {
    usuario: sessionStorage.usuario,
    senha: sessionStorage.senha,
    sql: sql
  })
  .then(function (response) {
      $.notify(`Você tem ${response.data.resposta[0].total} pesquisas respondidas hoje!`, {
        autoHideDelay: 8000,
        clickToHide: true,
        autoHide: true,
        className: 'info',
        showDuration: 1000,
        hideDuration: 1000,
        gap: 2
      });
      
  })
  .catch(function (error) {
      console.log(error);
  });
}

// Apaga pesquisas não respondidas a mais de 90 dias na tabela pesquisa_chat.
function apagar_pesquisas_nao_respondidas(){

  //Verifica se existe registros com pesquisas antigas
  axios.post(`${ip}listar_clientes`, {
    usuario: sessionStorage.usuario,
    senha: sessionStorage.senha,
    sql: "SELECT * FROM pesquisa_chat WHERE DATEDIFF(NOW(),hora_perg) > 90;"
  })
  .then(function (response) {
      let antigos = response.data.resposta.length;
      if(antigos > 0){

        // Apaga de fato
        axios.post(`${ip}listar_clientes`, {
          usuario: sessionStorage.usuario,
          senha: sessionStorage.senha,
          sql: "DELETE FROM pesquisa_chat WHERE DATEDIFF(NOW(),hora_perg) > 90;"
        })
        .then(function (response) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `${antigos} registros de pesquisa foram apagados, pois tem mais de 90 dias que não foram respondidos.`,
            showConfirmButton: false,
            timer: 8000
          });
        }).catch(function (error) { console.log(error); });

      }
  })
  .catch(function (error) {
      console.log(error);
  });
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

pesquisas_feitas_no_dia();
apagar_pesquisas_nao_respondidas();