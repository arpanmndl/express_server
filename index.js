import express from "express";

const app = express();
const port = 3000;

// accepting incoming json data
app.use(express.json());

// creating an empty array
let teaData = [];
// unique id to insert in the array
let nextId = 1;

// insert new tea to the array by getting the json data from the front-end
app.post("/teas", (req, res) => {
  //   console.log(req.body);
  const { name, price } = req.body;
  const newTea = { id: nextId++, name, price };
  teaData.push(newTea);
  res.status(201).send(newTea);
});

// list all the tea data available in the array
app.get("/teas", (req, res) => {
  res.status(200).send(teaData);
});

// getting a single tea from the list by using the id
app.get("/teas/:id", (req, res) => {
  const tea = teaData.find((t) => t.id === parseInt(req.params.id));
  if (!tea) {
    return res.status(404).send("404 Not Found");
  } else {
    res.status(200).send(tea);
  }
});

// update tea
app.put("/teas/:id", (req, res) => {
  const tea = teaData.find((t) => t.id === parseInt(req.params.id));
  if (!tea) {
    return res.status(404).send("404 Not Found");
  }
  // new values that we want to update we will get it from the req.body
  const { name, price } = req.body;
  tea.name = name;
  tea.price = price;
  res.status(200).send(tea);
});

// delete tea
app.delete("/teas/:id", (req, res) => {
  const idx = teaData.findIndex((t) => t.id === parseInt(req.params.id));
  if (idx === -1) {
    return res.status(404).send("Tea not found");
  }
  teaData.splice(idx, 1);
  nextId--;
  res.status(202).send("Tea deleted!");
});

app.listen(port, () => {
  console.log(`Server is listening at port ${port}...`);
});
