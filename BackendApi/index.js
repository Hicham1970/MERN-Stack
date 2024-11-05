var express = require("express");
var MongoClient = require("mongodb").MongoClient;
var cors = require("cors");
const multer = require("multer");
var dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/";
var app = express();

// frontend and backend are running on different ports, to fix this we need to add this middleware, mais avant ça il faut declarer le builder
// builder.Services.AddCors(options => {
//     options.AddPolicy("AllowAll",
//         builder => {
//             builder
//                 .AllowAnyOrigin()
//                 .AllowAnyMethod()
//                 .AllowAnyHeader();
//         });
// });


app.use(express.json());
app.use(cors());

var databaseName = "ContactsData";
var collectionName = "CollectionContacts";
var database;

// First establish database connection
MongoClient.connect(MONGO_URI)
    .then((client) => {
        database = client.db(databaseName);
        // Only start the server after successful database connection
        app.listen(PORT, () => {
            console.log(
                "Connected to the database and the Server is running on port " + PORT
            );
        });
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });

// Cette route GET permet de récupérer tous les contacts de la base de données
// This endpoint handles GET requests to fetch all contacts from the database
app.get("/api/Contacts/GetContacts", async (req, res) => {
    try {
        // Vérifie si la connexion à la base de données est établie

        if (!database) {
            return res
                .status(500)
                .json({ error: "Database connection not established" });
        }

        // Récupère tous les documents de la collection des contacts
        // Fetch all documents from contacts collection
        const result = await database.collection(collectionName).find({}).toArray();

        // Renvoie les résultats au format JSON

        res.json(result);
    } catch (err) {
        // En cas d'erreur, on log l'erreur et on renvoie un code 500

        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// post request
app.post('/api/Contacts/AddContacts', multer().none(), async (req, res) => {
    try {
        if (!database) {
            return res.status(500).json({ error: "Database connection not established" });
        }

        const newContact = {
            id: new Date().getTime().toString(), // More reliable ID generation
            name: req.body.name,
            email: req.body.email,
            message: req.body.message
        };

        await database.collection(collectionName).insertOne(newContact);
        res.status(201).json({ message: "Contact added successfully", contact: newContact });
    } catch (error) {
        console.error('Error adding contact:', error);
        res.status(500).json({ error: "Failed to add contact" });
    }
});

// Delete contact
const { ObjectId } = require('mongodb');

app.delete('/api/Contacts/DeleteContacts/:id', async (req, res) => {
    try {
        if (!database) {
            return res.status(500).json({ error: "Database connection not established" });
        }

        const result = await database.collection(collectionName).deleteOne({
            _id: new ObjectId(req.params.id)
        });

        if (result.deletedCount === 1) {
            res.json({ message: "Contact deleted successfully" });
        } else {
            res.status(404).json({ message: "Contact not found" });
        }
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ error: "Failed to delete contact" });
    }
});
