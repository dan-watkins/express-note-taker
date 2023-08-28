const express = require("express");
const fs = require('fs');
const res = require("express/lib/response");
const path = require("path");
const PORT = process.env.port || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//GET /notes should route to the notes.html file
app.get('/notes', (req, res) => 
res.sendFile(path.join(__dirname, '/public/notes.html'))
);
//GET * should route to the index.html file
app.get('/', (req, res) =>
res.sendFile(path.join(__dirname, '/public/index.html'))
);

//`GET /api/notes` should read the `db.json` file and return all saved notes as JSON. THIS NEEDS A HELPER CLASS TO REPLACE FS.READFILE, EXPECTING A CALLBACK.
app.get('/api/notes', (req, res) =>
fs.readFile('./db/notes.json').then((data) => res.json(JSON.parse(data)))
);

//`POST /api/notes` should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client.
//You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).

//`DELETE /api/notes/:id` should receive a query parameter that contains the id of a note to delete. To delete a note, you'll need to read all notes from the `db.json` file,
//remove the note with the given `id` property, and then rewrite the notes to the `db.json` file.


app.listen(PORT, () =>
console.log(`App listening at http://localhost:${PORT}`)
);