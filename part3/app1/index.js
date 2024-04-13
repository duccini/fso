const express = require("express");

const app = express();

// json-parser to make Express accept body data
app.use(express.json());

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
  const routeID = Number(request.params.id);
  const note = notes.find((note) => note.id === routeID);

  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

app.put("/api/notes/:id", (request, response) => {
  const routeID = Number(request.params.id);
  const note = notes.find((note) => note.id === routeID);

  if (!note) {
    return response.status(404).end();
  }

  const updatedNote = request.body;

  notes = notes.map((note) => {
    if (note.id !== routeID) {
      return note;
    } else {
      return updatedNote;
    }
  });

  response.json(updatedNote);
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);

  if (notes) {
    response.status(204).end();
  } else {
    response.status(404).end();
  }
});

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(),
  };

  notes = notes.concat(note);

  response.json(note);
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
