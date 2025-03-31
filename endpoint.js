const express = require("express");
const router = express.Router();
const db = require("./db");
const {verifyToken} = require ("./Middleware");
const bcrypt = require("bcrypt");
const {genSalt} = require("bcrypt");
const jwt = require ("jsonwebtoken");
const {sign} = require ("jsonwebtoken");

// npm install --save-dev jest


/*const {request, response} = require("express");*/
/* npm install jsonwebtoken*/
/* Route : List les produit
* GET /api/produit
* */

/*
router.get ("/produit", (req, res) => {
    db.query("SELECT * FROM produit", (err, result) => {
        if(err){
            return res.status(500).json({message :"Erreur du serveur"});
        }
        res.json(result);
    });
});
*/
router.get('/produit/:id', (req,res)=>{
    const {id} = req.params;

    db.query("select * from produit where id_produit = ?",[id] ,(error, result) => {
        if (error){
            return res.status(500).json({message: "Erreur du serveur"});
        }
        if (result.length === 0) {
            return res.status(400).json({message: "Produit non trouvé"});
        }

        return res.status(200).json(result[0])
    })
});

/* Connexion client (Génération de JWT)
* {
*   "email": "jean.dupondt@gmail.com",
 "mdp": "password"
* */


// Route connexion

router.post("/client/login", (req, res) =>{
    const {email,mdp} = req.body;

    db.query("SELECT * FROM client WHERE Mail_client = ?",
        [email],
        (err,result) => {
        if (err)
                return res.status(500).json({message: "Erreur du serveur"});

                if (result.length === 0) {
                    return res.status(401).json({message: "Identifiant incorrect"});
                }

                const client = result[0];
                /*Vérification MDP*/
                bcrypt.compare(mdp, client.mdp_client,(err, isMatch) => {
                    if (err) return res.status(500).json({message: "Erreur serveur"});
                    if (!isMatch)
                        return res.status(401).json({message: "Mot de passe incorrect"});

                 //Génération d'un TOKEN
                     const token = sign(
                         {id: client.id_client, email: client.Mail_client},
                         process.env.JWT_SECRET,
                         {expiresIn: process.env.JWT_EXPIRES_IN},
                     )

                    res.json({
                        message: "Connexion réussie",
                        token,
                        client: {
                            id: client.id_client,
                            nom: client.nom_prenom_client,
                            email: client.Mail_client
                        },
                    });
                });
        });
});












                /*
                * Route : Inscription d'un client
                * POST /api/clients/register
                * Exemple : JSON
                {
"nom_prenom_client": "Dupont",
 "Telephone_client": "064512595",
 "Date_inscription_client":"2024-02-15",
 "Mail_client": "jean.dupondt@gmail.com",
 "mdp_client": "password",
 "adresse_client": "20 rue de la croix, Paris"
}
                */



                // router.get ("/produit", (req, res) => {
                //     db.query("SELECT * FROM produit", (err, result) => {
                //         if(err){
                //             return res.status(500).json({message :"Erreur du serveur"});
                //         }
                //         res.json(result);
                //     });
                // });

                router.get ("/produit", (req, res) => {
                    db.query("SELECT * FROM produit LIMIT 3", (err, result) => {
                        if(err){
                            return res.status(500).json({message :"Erreur du serveur"});
                        }
                        res.json(result);
                    });
                });


                //Route accessoires

                router.get ("/accessoires", (req, res) => {
                    db.query("SELECT produit.id_produit, produit.id_categorie, produit.designation_produit, categorie.id_categorie, produit.prix_ht_produit FROM `produit` JOIN categorie ON categorie.id_categorie = produit.id_categorie WHERE categorie.type_categorie = 'Accessoires' ",
                        (err, result) => {
                        if(err){
                            return res.status(500).json({message :"Erreur du serveur"});
                        }
                        res.json(result);
                    });
                });



                //Route Cafe


router.get ("/cafe", (req, res) => {
    db.query("SELECT produit.id_produit, produit.id_categorie, produit.designation_produit, categorie.id_categorie, produit.prix_ht_produit FROM `produit` JOIN categorie ON categorie.id_categorie = produit.id_categorie WHERE categorie.type_categorie = 'Café'; ",
        (err, result) => {
            if(err){
                return res.status(500).json({message :"Erreur du serveur"});
            }
            res.json(result);
        });
});


                // Route Thé
router.get ("/the", (req, res) => {
    db.query("SELECT produit.id_produit, produit.id_categorie, produit.designation_produit, categorie.id_categorie, produit.prix_ht_produit FROM `produit` JOIN categorie ON categorie.id_categorie = produit.id_categorie WHERE categorie.type_categorie = 'Thé' ",
        (err, result) => {
            if(err){
                return res.status(500).json({message :"Erreur du serveur"});
            }
            res.json(result);
        });
});





                    router.post("/client/register", (req, res) => {
                    const {nom_prenom_client, Telephone_client, Date_inscription_client, Mail_client, mdp_client, adresse_client} = req.body;
                    // Controler si le mail est deja present dans la bdd

                    db.query('select * from client where Mail_client = ?', [Mail_client], (err, result) => {
                        if (err){
                            return res.status(500).json({message: "Erreur du serveur"});
                        }
                        if (result.length > 0) {
                            return res
                                .status(400)
                                .json({message: "Cet email est deja utilisé"});
                        }

                        //Hachage du mdp
                        bcrypt.hash(mdp_client, 10, (err,hash) => {
                            if (err) {
                                return res
                                    .status(500)
                                    .json({message: "Erreur lors hachage du mdp"});
                            }

                            // Insertion du new client
                            db.query("INSERT INTO client (nom_prenom_client, Telephone_client, Date_inscription_client, Mail_client, mdp_client, adresse_client) values (?,?,?,?,?,?)",
                                [nom_prenom_client, Telephone_client, Date_inscription_client, Mail_client, hash, adresse_client],
                                (err, result) => {
                                    if (err) {console.log(err);
                                        return res.status(500).json({message: "Erreur de l'inscription"});
                                    }
                                    res.status(201).json({message: "Inscription réussie", id_client: result.insertId});
                                })

                        })
                    });
                });

// Road update client

                router.put("/client/:id", (req, res) => {
                    const {id} = req.params;
                    const {
                        Telephone,
                        Mail,
                        adresse
                    } = req.body;

                    db.query("UPDATE client SET Telephone_client= ? , Mail_client= ?, adresse_client= ? WHERE id_client= ?",
                        [Telephone, Mail,adresse, id],
                        (err, result) => {
                            if (err) {
                                console.log(err);
                                return res.status(500).json({message: "Erreur de l'information"});
                            }
                            res.status(201).json({message: "Information changées"});
                        })
                });


// route fiche client

router.get('/client/:id',  (req, res) => {

    const id_client = req.params.id;
    const query = `SELECT id_client, Telephone_client, Mail_client, nom_prenom_client FROM Client WHERE id_client = ?`;

    db.query(query, [id_client], (err, result) => {
        if (err) {
            return res.status(500).json({error: 'Erreur lors de la récupération du client'});
        }
        if (result.length === 0) {
            return res.status(404).json({message: 'Client non trouvé'});
        }
        res.json(result[0]);
    });
});



router.get("/produit/details/:id", (req, res) => {
    db.query("SELECT description_produit, designation_produit, stock_produit, Type_conditionnement, id_categorie, image_produit, prix_ht_produit FROM produit where id_produit = ?",[req.params.id], (error, result) => {
        if (error){
            return(res.status(500).json({message : "Erreur du serveur"}));
        }
        if (result.length === 0){
            return res.status(404).json({message: " produit non trouvé"});
        }
        res.json(result[0]);
    })
});

//Suppresion d'un client

router.delete('/client/5', (req, res) => {
    const id_client = req.params.id;
    const querySelect = `SELECT id_client FROM client WHERE id_client = ?`;
    const queryDelete = `DELETE FROM client WHERE id_client = ?`;

    db.query(querySelect, [id_client], (err, result) => {
        if (err) {
            return res.status(500).json({ error: `Erreur lors de la vérification du client` });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: `Client non trouvé` });
        }

        db.query(queryDelete, [id_client], (err, deleteResult) => {
            if (err) {
                return res.status(500).json({ error: `Erreur lors de la suppression du client` });
            }
            res.json({ message: `Client supprimé avec succès` });
        });
    });
});


router.get("/produit", (req, res) => {
    console.log("Requête reçue avec req.query :", req.query);
    const { filter } = req.query;
    let sqlQuery = `SELECT produit.*, categorie.type_categorie FROM produit
JOIN categorie ON _categorie.id_categorie = produit.id_categorie`;

    if (filter === "desc") {
        sqlQuery += " ORDER BY product_price DESC";
    } else if (filter === "asc") {
        sqlQuery += " ORDER BY product_price ASC";
    }

    console.log("Requête SQL exécutée :", sqlQuery);
    db.query(sqlQuery, (err, result) => {
        if (err) {
            console.error("Erreur SQL :", err);
            return res.status(500).json({ message: "Erreur du serveur" });
        }
        res.json(result);
    });
});










module.exports = router;











