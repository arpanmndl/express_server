import "dotenv/config";
import logger from "./logger.js";
import morgan from "morgan";
import express from "express";

const app = express();
const port = process.env.PORT || 3000;

// accepting incoming json data
app.use(express.json());

const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

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
  if (teaData.length) {
    return res.status(200).send(teaData);
  } else {
    return res.status(404).send("Tea list empty");
  }
});

// getting a single tea from the list by using the id
app.get("/teas/:id", (req, res) => {
  const tea = teaData.find((t) => t.id === parseInt(req.params.id));
  if (!tea) {
    return res.status(404).send("Tea not found!!");
  } else {
    res.status(200).send(tea);
  }
});

// update tea
app.put("/teas/:id", (req, res) => {
  const tea = teaData.find((t) => t.id === parseInt(req.params.id));
  if (!tea) {
    return res.status(404).send("Invalid tea Id");
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
  if (teaData.length > 0) {
    nextId = teaData[teaData.length - 1].id + 1;
  } else if ((teaData.length = 0)) {
    nextId = 1;
  }
  res.status(200).send("Tea deleted!");
});

app.listen(port, () => {
  console.log(`Server is listening at port ${port}...`);
});
