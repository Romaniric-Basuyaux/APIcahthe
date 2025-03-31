const express = require("express");

const cors = require("cors");

const DB = require("./db");// connexion MySQL

const routes = require("./endpoint") //route de l'API

const app = express();
app.use(express.json());
app.use(cors());

//Utilisation des routes

app.use("/api", routes);

//Demarrer le serveur
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`L'API cafthe est démarré sur http://localhost:${PORT}`);
});
