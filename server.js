const express = require("express");
const path = require("path");
const notesData = require("./db/db.json");

const PORT = 3001;

const app = express();

app.use(express.static("public"));
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);

// Get request for notes database
app.get("/api/notes", (req, res) => {
  console.log(`${req.method} request received to get notes`);
  res.json(notesData);
});

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));
