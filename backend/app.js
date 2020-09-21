const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
require("dotenv").config();

const app = express();

//Execution de helmet pour la securité
app.use(helmet());
//Execution de Express Static pour se servir des images
app.use(express.static('public'));

//Connexion a la base de donnée
mongoose.connect('mongodb+srv://' + process.env.DBlog + ':' + process.env.DBpass + '@cluster0.vgbyr.mongodb.net/SoPekocko?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Utilisation de bodyParser pour recuperer l'objet en format JSON automatiquement
app.use(bodyParser.json());

//Configuration  des header pour permetttre les echange entre localhost 3000 et 4200
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//On defini les routes
app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);

module.exports = app;