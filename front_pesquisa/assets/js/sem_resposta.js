var login = sessionStorage.login;
const ip = sessionStorage.ip;

$(document).ready(function() { 
  axios.post(`${ip}listar_clientes`, {
      usuario: sessionStorage.usuario,
      senha: sessionStorage.senha,
      sql: "SELECT *, DATE_FORMAT(hora, '%d/%m/%Y %H:%i') as hora_resp FROM nao_respondeu;"
    }).then(function (response) {
        var table = "";
        
        for (let index = 0; index < response.data.resposta.length; index++){
          table = table + `<tr>
          <td>${index + 1}</td>
          <td>${response.data.resposta[index].nome}</td>
          <td>${response.data.resposta[index].cel}</td>
          <td>${response.data.resposta[index].msg}</td>
          <td>${response.data.resposta[index].hora_resp}</td>
          </tr>`
        }
        document.getElementById('corpo').innerHTML = table;

        $('#tabela').DataTable(
          {
            paging: false,
          "language": { 
            "sEmptyTable": "Nenhum registro encontrado", 
            "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros", 
            "sInfoEmpty": "Mostrando 0 até 0 de 0 registros", 
            "sInfoFiltered": "(Filtrados de _MAX_ registros)", 
            "sInfoPostFix": "", 
            "sInfoThousands": ".", 
            "sLengthMenu": "Mostrando _MENU_ resultados por página", 
            "sLoadingRecords": "Carregando...", 
            "sProcessing": "Processando...", 
            "sZeroRecords": "Nenhum registro encontrado", 
            "sSearch": "Pesquisar", 
            "oPaginate": { 
                "sNext": "Próximo", 
                "sPrevious": "Anterior", 
                "sFirst": "Primeiro", 
                "sLast": "Último" 
            }, 
            "oAria": { 
                "sSortAscending": ": Ordenar colunas de forma ascendente", 
                "sSortDescending": ": Ordenar colunas de forma descendente" 
            }, 
            "select": { 
                "rows": { 
                    "_": "Selecionado %d linhas", 
                    "0": "Nenhuma linha selecionada", 
                    "1": "Selecionado 1 linha" 
                } 
            }, 
            "buttons": { 
                "copy": "Copiar", 
                "copyTitle": "Cópia bem sucedida", 
                "copySuccess": { 
                    "1": "Uma linha copiada com sucesso", 
                    "_": "%d linhas copiadas com sucesso" 
                } 
            } 
          }, 
          responsive: "true", 
          dom: 'Bfrtip',
              buttons: [
                  { 
                      extend:    'print', 
                      text:      '<i class="fa fa-print"></i> ', 
                      titleAttr: 'Imprimir', 
                      className: 'btn btn-info' 
                  }, 
                  { 
                      extend:    'excelHtml5', 
                      text:      '<i class="fa fa-file-excel"></i>', 
                      titleAttr: 'Excel', 
                      className: 'btn btn-success' 
                  }, 
                  { 
                      extend:    'pdfHtml5', 
                      text:      '<i class="fas fa-file-pdf"></i>', 
                      titleAttr: 'PDF', 
                      className: 'btn btn-danger' 
                  } 
              ] 
        });

    }).catch(function (error) { console.log(error); });
} );

function sair(){
  sessionStorage.login = 'NOT';
  sessionStorage.ip = '...';
  sessionStorage.usuario = "...";
  sessionStorage.senha = "...";
  location.replace("index.html");
}