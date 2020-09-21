const http = require('http');
const app = require('./app');

//Port a utiliser pour le serveur
app.set('port', process.env.PORT || 3000);
const server = http.createServer(app);

//Ecoute l'evenement sur le port du serveur
server.listen(process.env.PORT || 3000);