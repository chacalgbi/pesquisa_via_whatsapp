const app = require('./app');
const dataHora = require('./config/dataHora');

app.listen(3366, () => {
    console.log(dataHora(),"Pesquisa WHATSAPP iniciada na porta 3366");
});