sessionStorage.ip = 'http://localhost:3366/';

function login(){
    const ip = sessionStorage.ip;
    const login = document.getElementById('usuario').value;
    const senha = document.getElementById('password').value;
    if(login == '' || senha == ''){
        document.getElementById('msg').innerHTML = 'Preencha os campos.';
        swal("Aviso!", "Preencha os campos!", "info");
    }else{
        axios.post(`${ip}login`, {
            usuario: login,
            senha: senha
        })
        .then(function (response) {
            console.log(response.data);
            
            if(response.data.error == 'sim'){
            document.getElementById('msg').innerHTML = response.data.msg;
            sessionStorage.login = 'NOT';
            swal("Erro!", "Dados inválidos!", "error");
            }else{
                sessionStorage.usuario = login; 
                sessionStorage.senha = senha; 
                sessionStorage.login = 'OK';       
                document.getElementById('msg').innerHTML = response.data.msg;
                setTimeout(function() { // delay de 1 segundo
                    location.replace("lista.html");
                }, 1000);
            }
            
        })
        .catch(function (error) {
            console.log(error);
            document.getElementById('msg').innerHTML = response.data.msg;
        });
    }
  }