var login = sessionStorage.login;
const ip = sessionStorage.ip;
var nome_rotulo = '';
var Grafico; 
var nota0 = '';
var nota1 = '';
var nota2 = '';
var nota3 = '';
var nota4 = '';
var nota5 = '';
var nota6 = '';
var nota7 = '';
var nota8 = '';
var nota9 = '';
var nota10 = '';

$('#relatorioModal').on('show.bs.modal', function (event) {
  //let titulo = document.getElementById('selecionar_notas').text;
  let titulo = $('#selecionar_pesquisa :selected').text();
  document.getElementById('corpo').innerHTML = '';
  document.getElementById('pesquisa_atual').innerHTML = titulo;
})

function sair(){
  sessionStorage.login = 'NOT';
  sessionStorage.ip = '...';
  sessionStorage.usuario = "...";
  sessionStorage.senha = "...";
  location.replace("index.html");
}

function grafico(dados, rotulo){

  if(Grafico){Grafico.destroy();}

  const labels = ['Média Geral', 'Nota 0', 'Nota 1', 'Nota 2', 'Nota 3', 'Nota 4', 'Nota 5', 'Nota 6', 'Nota 7', 'Nota 8', 'Nota 9', 'Nota 10'];
  const data = {
    labels: labels,
    datasets: [{
      label: rotulo,
      data: dados,
      backgroundColor: [
        'rgba(105,105,105, 1)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(0, 250, 154, 0.2)'
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgb(255, 99, 132, 1)',
        'rgb(255, 159, 64, 1)',
        'rgb(255, 205, 86, 1)',
        'rgb(75, 192, 192, 1)',
        'rgb(54, 162, 235, 1)',
        'rgb(153, 102, 255, 1)',
        'rgb(0,255,127, 1)'
      ],
      borderWidth: 1
    }]
  };

  const config = {
    type: 'bar',
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
  };

  Grafico = new Chart(document.getElementById('grafico'), config);

}

function listar_notas(item){
  document.getElementById('corpo').innerHTML = '';
       if(item.value == '0') { document.getElementById('corpo').innerHTML = nota0;  }
       if(item.value == '1') { document.getElementById('corpo').innerHTML = nota1;  }
  else if(item.value == '2') { document.getElementById('corpo').innerHTML = nota2;  }
  else if(item.value == '3') { document.getElementById('corpo').innerHTML = nota3;  }
  else if(item.value == '4') { document.getElementById('corpo').innerHTML = nota4;  }
  else if(item.value == '5') { document.getElementById('corpo').innerHTML = nota5;  }
  else if(item.value == '6') { document.getElementById('corpo').innerHTML = nota6;  }
  else if(item.value == '7') { document.getElementById('corpo').innerHTML = nota7;  }
  else if(item.value == '8') { document.getElementById('corpo').innerHTML = nota8;  }
  else if(item.value == '9') { document.getElementById('corpo').innerHTML = nota9;  }
  else if(item.value == '10'){ document.getElementById('corpo').innerHTML = nota10; }
}

function listar_pesquisas(item){
  nota0 = '';
  nota1 = '';
  nota2 = '';
  nota3 = '';
  nota4 = '';
  nota5 = '';
  nota6 = '';
  nota7 = '';
  nota8 = '';
  nota9 = '';
  nota10 = '';

  const valores = item.value.split('|');
  const sql = `SELECT * FROM resultado_chat WHERE id_pesquisa='${valores[0]}';`;
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
      let dados = [];
      let rotulo = valores[1];
      document.getElementById('msg').innerHTML = `<i class='bx bx-line-chart'></i> Gráfico: Total Respostas: ${response.data.resposta.length}`;
      let zero = 0;
      let um = 0;
      let dois = 0;
      let tres = 0;
      let quatro = 0;
      let cinco = 0;
      let seis = 0;
      let sete = 0;
      let oito = 0;
      let nove = 0;
      let dez = 0;
      let media = 0;

      response.data.resposta.forEach((item, index)=>{
        media = media + item.resposta;

             if(item.resposta == 0) { zero++;     
              nota0 = nota0 + `<tr><td>${item.nome}</td><td>${item.cel}</td><td>${item.perfil}</td><td>${item.resposta}</td><td>${item.comen_resp}</td></tr>`;
            }
        else if(item.resposta == 1) { um++;   
          nota1 = nota1 + `<tr><td>${item.nome}</td><td>${item.cel}</td><td>${item.perfil}</td><td>${item.resposta}</td><td>${item.comen_resp}</td></tr>`;
        }
        else if(item.resposta == 2) { dois++;   
          nota2 = nota2 + `<tr><td>${item.nome}</td><td>${item.cel}</td><td>${item.perfil}</td><td>${item.resposta}</td><td>${item.comen_resp}</td></tr>`;
        }
        else if(item.resposta == 3) { tres++;   
          nota3 = nota3 + `<tr><td>${item.nome}</td><td>${item.cel}</td><td>${item.perfil}</td><td>${item.resposta}</td><td>${item.comen_resp}</td></tr>`;
        }
        else if(item.resposta == 4) { quatro++; 
          nota4 = nota4 + `<tr><td>${item.nome}</td><td>${item.cel}</td><td>${item.perfil}</td><td>${item.resposta}</td><td>${item.comen_resp}</td></tr>`;
        }
        else if(item.resposta == 5) { cinco++;  
          nota5 = nota5 + `<tr><td>${item.nome}</td><td>${item.cel}</td><td>${item.perfil}</td><td>${item.resposta}</td><td>${item.comen_resp}</td></tr>`;
        }
        else if(item.resposta == 6) { seis++;   
          nota6 = nota6 + `<tr><td>${item.nome}</td><td>${item.cel}</td><td>${item.perfil}</td><td>${item.resposta}</td><td>${item.comen_resp}</td></tr>`;
        }
        else if(item.resposta == 7) { sete++;   
          nota7 = nota7 + `<tr><td>${item.nome}</td><td>${item.cel}</td><td>${item.perfil}</td><td>${item.resposta}</td><td>${item.comen_resp}</td></tr>`;
        }
        else if(item.resposta == 8) { oito++;   
          nota8 = nota8 + `<tr><td>${item.nome}</td><td>${item.cel}</td><td>${item.perfil}</td><td>${item.resposta}</td><td>${item.comen_resp}</td></tr>`;
        }
        else if(item.resposta == 9) { nove++;   
          nota9 = nota9 + `<tr><td>${item.nome}</td><td>${item.cel}</td><td>${item.perfil}</td><td>${item.resposta}</td><td>${item.comen_resp}</td></tr>`;
        }
        else if(item.resposta == 10){ dez++;    
          nota10 = nota10 + `<tr><td>${item.nome}</td><td>${item.cel}</td><td>${item.perfil}</td><td>${item.resposta}</td><td>${item.comen_resp}</td></tr>`;
        }
      });
      media = media / response.data.resposta.length;
      
      dados.push(media);
      dados.push(zero);
      dados.push(um);
      dados.push(dois);
      dados.push(tres);
      dados.push(quatro);
      dados.push(cinco);
      dados.push(seis);
      dados.push(sete);
      dados.push(oito);
      dados.push(nove);
      dados.push(dez);

      grafico(dados, rotulo);
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
        var table = "<option disabled selected>Selecione uma Pesquisa feita</option>";
        for (let index = 0; index < response.data.resposta.length; index++){
          table = table + `<option value="${response.data.resposta[index].id}|${response.data.resposta[index].topico}">${response.data.resposta[index].data_hora} - ${response.data.resposta[index].usuario} - ${response.data.resposta[index].topico}</option>`;
        }
        document.getElementById('selecionar_pesquisa').innerHTML = table;
      }
    })
    .catch(function (error) {
      console.log(error);
    });

}