const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require("body-parser");
const router = require('./src/routes/marker')

app.use(express.static('public'));

// app.use(router);
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use("/", router)

const port = process.env.PORT || 3900;

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}...`);
});
