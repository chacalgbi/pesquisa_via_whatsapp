function score_parcial(item){
    let detrator = 0;
    let promotor = 0;
    const sql = `SELECT * FROM resultado_chat WHERE id_pesquisa='${item}';`;
    return new Promise((resolve, reject) =>{
        axios.post(`${ip}listar_clientes`, {
            usuario: sessionStorage.usuario,
            senha: sessionStorage.senha,
            sql: sql
          }).then(function (response) {
              response.data.resposta.forEach((item, index)=>{
                     if(item.resposta < 7) { detrator ++; }
                else if(item.resposta > 8) { promotor ++; }
              });
              if(detrator === 0 && promotor === 0){resolve(["erro",0,0,0]);}
              let porcent_promotores = parseFloat(((promotor / response.data.resposta.length)*100).toFixed(1));
              let porcent_detratores = parseFloat(((detrator / response.data.resposta.length)*100).toFixed(1));
              let score_nps = porcent_promotores - porcent_detratores;
              resolve([score_nps, porcent_promotores, porcent_detratores, response.data.resposta.length]);
          })
          .catch(function (error) {
            reject(error);
          });
    });
}

function buscar_pesquisas(){
    return new Promise((resolve, reject) =>{
        axios.post(`${ip}listar_pesquisas`, {
        usuario: sessionStorage.usuario,
        senha: sessionStorage.senha
        }).then(function (response) {
            const resposta = JSON.parse(JSON.stringify(response));
            resolve(resposta);
        })
        .catch(function (error) {
            reject(error);
        });
    });
}

async function buscar(){
    let qtd_validas = 0;
    let numero_de_respostas = 0;
    let total_promotores = 0;
    let total_detratores = 0;
    let score_geral_micks = 0;
    let qtd_pesquisas = 0;

    const resp_pesquisas = await buscar_pesquisas();
    qtd_pesquisas = resp_pesquisas.data.resposta.length;

    for (const [index, pesquisa] of resp_pesquisas.data.resposta.entries()) {
        const score_individual = await score_parcial(pesquisa.id);
        numero_de_respostas = numero_de_respostas + score_individual[3];
        if(score_individual[0] != "erro") {
            qtd_validas++;
            score_geral_micks = score_geral_micks + score_individual[0];
            total_promotores  = total_promotores  + score_individual[1];
            total_detratores  = total_detratores  + score_individual[2];
        }
    }

    score_geral_micks = score_geral_micks / qtd_validas;
    total_promotores  = total_promotores  / qtd_validas;
    total_detratores  = total_detratores  / qtd_validas;

    console.log("Total Pesquisas: ", qtd_pesquisas);
    console.log("Total Pesquisas Válidas: ", qtd_validas);
    console.log("Total de Respostas: ", numero_de_respostas);
    console.log("Score Total: ", score_geral_micks);
    console.log("Total Promotores: ", total_promotores);
    console.log("Total Detratores: ", total_detratores);

    Swal.fire({
        title: '<strong>Score Geral</strong>',
        icon: 'info',
        html:
          `<b>Total Pesquisas: </b> <strong style="color: #e83e0f;"> ${qtd_pesquisas} </strong> <br>` +
          `<b>Total Pesquisas Válidas: </b> <strong style="color: #e83e0f;"> ${qtd_validas} </strong> <br>` +
          `<b>Total de Respostas: </b> <strong style="color: #e83e0f;"> ${numero_de_respostas} </strong> <br>` +
          `<b>Score Total: </b> <strong style="color: #e83e0f;"> ${score_geral_micks} </strong> <br>` +
          `<b>Total Promotores: </b> <strong style="color: #e83e0f;"> ${total_promotores} </strong> <br>` +
          `<b>Total Detratores: </b> <strong style="color: #e83e0f;"> ${total_detratores} </strong> <br>`,
        showCloseButton: false,
        showCancelButton: false,
        focusConfirm: false,
        confirmButtonText:
          '<i class="fa fa-thumbs-up"></i> OK!',
        confirmButtonAriaLabel: 'Thumbs up, great!',
        cancelButtonText:
          '<i class="fa fa-thumbs-down"></i>',
        cancelButtonAriaLabel: 'Thumbs down'
      })

}