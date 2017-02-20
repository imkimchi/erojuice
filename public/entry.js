require('../node_modules/bulma/css/bulma.css');
require('./css/aside.css');
require('./css/main.css');
require('./js/fetch.js');


fetch('http://localhost:3000/getData')
  .then(res => console.log(res.json))
  .catch(err => console.error(err))