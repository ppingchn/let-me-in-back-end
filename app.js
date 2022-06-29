// Libary import
require('dotenv').config();
const express = require('express');

const cors = require('cors');

const { sequelize } = require('./models/index');
// sequelize.sync({ force: true });
// sequelize.sync({ alter: true });

//import route
const registerRoute = require('./routes/registerRoute');
const loginRoute = require('./routes/loginRout');
const errorMiddleware = require('./middlewares/error');
const notFoundMiddleware = require('./middlewares/notFound');
const authenticate = require('./middlewares/authenticate');
const userRoute = require('./routes/userRoute');
const followRoute = require('./routes/followRoute');

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//login and register
app.use('/login', loginRoute);
app.use('/register', registerRoute);
app.use('/users', authenticate, userRoute);
// app.use('/follow', authenticate, followRoute);
app.use('/follow', authenticate, followRoute);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`This server running on PORT ${process.env.PORT}`);
});
