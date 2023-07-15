const express = require("express");
const path = require("path");
const fs = require("fs");
let notesData = require("./db/db.json");
const { v4: uuidv4 } = require("uuid");
const { raw } = require("express");

// If listening on Heroku, use the Heroku port, else use local port
const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);

// Get request for notes database
app.get("/api/notes", (req, res) => {
  console.info(`${req.method} request received`);
  res.json(notesData);
});

// Post request for adding a new note
app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received`);

  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    // Add to existing database
    notesData = notesData.concat([newNote]);
    fs.writeFileSync("./db/db.json", JSON.stringify(notesData), (error) =>
      error
        ? console.error("Error writing file: ", error)
        : console.log("Data updated successfully")
    );

    const response = {
      status: "success",
      body: notesData,
    };

    console.log(response.status);
    res.status(201).json(response);
  } else {
    res.status(500).json("Error adding note");
  }
});

// Delete request for deleting a note
app.delete("/api/notes/:id", (req, res) => {
  console.info(`${req.method} request received`);

  const noteId = req.path.split("/")[3];
  for (let note of notesData) {
    if (noteId === note.id) {
      let index = notesData.indexOf(note);
      notesData.splice(index, 1);
      fs.writeFileSync("./db/db.json", JSON.stringify(notesData), (error) =>
        error
          ? console.error("Error updating data after delete: ", error)
          : console.log("Data udpated successfully")
      );
    }
  }

  const response = {
    status: "success",
    body: notesData,
  };

  console.log(response.status);
  res.status(201).json(response);
});

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));
