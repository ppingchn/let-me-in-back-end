// Libary import
require('dotenv').config();
const express = require('express');
const cors = require('cors');

//internal import
const { sequelize } = require('./models');

// using module
const app = express();

// DataBase Create
// sequelize.sync({ alert: true });

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(process.env.PORT, () => {
  console.log(`This server running on PORT ${process.env.PORT}`);
});
