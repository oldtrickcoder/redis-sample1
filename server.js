const express = require("express");
const { Intro, getSpeciesData } = require("./controller");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", Intro);
app.get("/fish/:species", getSpeciesData);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
