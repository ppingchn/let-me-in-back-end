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
const educationRoute = require('./routes/educationRoute');
const experienceRoute = require('./routes/experienceRoute');
const friendRouter = require('./routes/friendsRoute');
const postRoute = require('./routes/postRoute');
const postPicRoute = require('./routes/postPicRoute');
const commentRoute = require('./routes/commentRoute');
const likeRout = require('./routes/likeRoute');
const likeCommentRout = require('./routes/likeCommentRoute');
const repliesCommentRoute = require('./routes/replyRoute');

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

//post
app.use('/post', postRoute);
app.use('/friends', authenticate, friendRouter);
app.use('/follow', authenticate, followRoute);

// add user detail
app.use('/experience', authenticate, experienceRoute);
app.use('/education', authenticate, educationRoute);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

//postPic
app.use('/postPic', postPicRoute);

//comment
app.use('/comment', commentRoute);

//like post
app.use('/like', likeRout);

//like comment
app.use('/likeComment', likeCommentRout);

//reply
app.use('/repliesComment', repliesCommentRoute);
// app.use('/follow', authenticate, followRoute);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`This server running on PORT ${process.env.PORT}`);
});
