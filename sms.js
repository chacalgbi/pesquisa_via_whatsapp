const axios = require('axios');

axios.post("http://172.17.1.187/teste", {
    "key": "QMDCGQ889B",
    "numero": "77988188514",
    "msg": "Micks informa. Ola"
}).then(function (response) {
   console.log(response);
}).catch(function (error) { console.log(error); });