const express = require("express");
const res = require("express/lib/response");
const path = require("path");
const {
  readAndAppend,
  readFromFile,
  writeToFile,
} = require("./helpers/fsUtils");
const { v4: uuidv4 } = require("uuid");
const PORT = process.env.port || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.get("/api/notes", (req, res) =>
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)))
);

app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    readAndAppend(newNote, "./db/db.json");

    const response = {
      status: "success",
      body: newNote,
    };

    res.json(response);
  } else {
    res.json("Error posting note");
  }
});

app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  readFromFile('./db/db.json')
  .then((data) => JSON.parse(data))
  .then((json) => {
    const result = json.filter((note) => note.id !== noteId);
    writeToFile('./db/db.json', result);
    res.json(`${noteId} has been deleted.`);
  });
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
