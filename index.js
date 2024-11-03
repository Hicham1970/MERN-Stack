var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var cors = require('cors');
const multer = require('multer');
var dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/';
var app = express();

app.use(express.json());
app.use(cors());

var databaseName = "ContactsData";
var collectionName = "CollectionContacts";
var database;

// First establish database connection
MongoClient.connect(MONGO_URI)
    .then(client => {
        database = client.db(databaseName);
        // Only start the server after successful database connection
        app.listen(PORT, () => {
            console.log("Connected to the database and the Server is running on port " + PORT);
        });
    })
    .catch(err => {
        console.error("Database connection error:", err);
    });

// Cette route GET permet de récupérer tous les contacts de la base de données
// This endpoint handles GET requests to fetch all contacts from the database
app.get('/api/Contacts/GetContacts', async (req, res) => {
    try {
        // Vérifie si la connexion à la base de données est établie
        // Check if database connection exists
        if (!database) {
            return res.status(500).json({ error: "Database connection not established" });
        }

        // Récupère tous les documents de la collection des contacts
        // Fetch all documents from contacts collection
        const result = await database.collection(collectionName).find({}).toArray();

        // Renvoie les résultats au format JSON
        // Return results as JSON
        res.json(result);

    } catch (err) {
        // En cas d'erreur, on log l'erreur et on renvoie un code 500
        // If error occurs, log it and return 500 status
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});
