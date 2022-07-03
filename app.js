// Libary import
require('dotenv').config();
const express = require('express');
const socketio = require('socket.io');
const http = require('http');

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
const chatMessageRoute = require('./routes/chatMessageRoute');
const chatRoomRoute = require('./routes/chatRoomRoute');

const app = express();

//socket io
const server = http.createServer(app);
//make connection to io and config cor
const { io } = require('./util/socket');
io.attach(server);

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

//chatMsg

app.use('/chatMessage', chatMessageRoute);
//chat room for keep list msg
app.use('/chatRoom', chatRoomRoute);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

server.listen(process.env.PORT, () => {
  console.log(`This server running on PORT ${process.env.PORT}`);
});
