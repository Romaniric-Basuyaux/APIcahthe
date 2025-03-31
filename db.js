const mysql = require("mysql2");
require("dotenv").config(); // Permet de charger kes variables d'environnement

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASWWORD,
    database: process.env.DB_NAME,
});

db.connect((error) => {
    if (error){
        console.error("Erreur de connnexion MySQL :", error);
        process.exit(1);
    }

    console.log("Connecté à la base de données MySQL");
});

module.exports = db;