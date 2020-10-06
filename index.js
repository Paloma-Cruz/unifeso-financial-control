const express = require("express");
const mongoose = require("mongoose");
const { User } = require("./models");

mongoose.connect(
  "mongodb+srv://unifeso:unifeso-password@unifeso.kwuxv.gcp.mongodb.net/unifeso-financial-control?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error: "));
db.once("open", function () {
  console.log("MongoDB Connected.");
});

const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// CREATE
app.post("/", async (request, response) => {
  const jsonContent = request.body;
  const user = await User.create(jsonContent);
  response.status(201).send(user);
});

// READ
app.get("/:id", async (request, response) => {
  const obj = await User.findById(request.params.id);
  if (!obj) {
    return response.status(404).send({
      message: "Not found"
    });
  }
  response.status(200).send(obj);
});

// UPDATE
app.put("/:id", async (request, response) => {
  const obj = request.body;
  if (!obj) {
    return response.status(412).send({
      message: "O corpo da mensagem é obrigatório"
    });
  } else {
    const upd = await User.replaceOne({ _id: request.params.id }, obj);
  }
  response.status(200).send(obj);
});

// DELETE
app.delete("/:id", (request, response) => {
  User.remove( { _id: request.params.id } );
  response.status(204).end();
});

const port = 8090;
app.listen(port, () => console.log(`Rodando em localhost:${port}`));
