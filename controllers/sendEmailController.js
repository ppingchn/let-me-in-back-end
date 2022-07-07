const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const createError = require('../util/createError');
const { User, ResetPassword } = require('../models');

const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL,
  REFRESH_TOKEN,
} = require('../config/constants');

//เหมือนpassport ตัวนึงของgoogle
//-----------------------------------------------------------------
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL,
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
//-----------------------------------------------------------------

const createToken = (payload) =>
  //expires in 10 minite
  jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: 60 * 10,
  });

exports.sendEmailForgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      createError("Don't have this user");
    }

    const token = createToken({ email });
    // console.log(token);

    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      // host: 'smtp.ethereal.email',
      // port: 587,
      // secure: false, // true for 465, false for other ports
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'paruj.lab@gmail.com', // generated ethereal user
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
        // pass: "123", // generated ethereal password
      },
    });
    const option = {
      from: 'LET-ME-IN😊 <paruj.lab@gmail.com>', // sender address
      to: email, // list of receivers
      subject: 'Change Password', // Subject line
      text: 'Hello', // plain text body
      html: `  <div
      style="
        width: 350px;
        background-color: #3381ca;
        border-radius: 5px;
        padding: 10px 15px;
        font-family: Arial;
        text-align: center;
      "
    >
      <p style="font-size: 36px; font-weight: 700; color: white">Let-me-in</p>
      <div
        style="
          background-color: rgb(229 231 235);
          width: 100%;
          border-radius: 5px;
          padding: 30px 30px;
          box-sizing: border-box;
          text-align: center;
          color: #303030;
        "
      >
        <p style="padding: 0px">Hi John wick,</p>
        <p style="padding: 0px; margin-bottom: 40px; font-size: smaller">
          You recently requested to reset your <br />
          Let-me-in account password
        </p>
        <a
        href="http://localhost:3000/changePassword/${token}"
          style="
            width: 100%;
            padding: 15px 40px;
            max-width: 250px;
            border: none;
            background-color: #3381ca;
            border-radius: 5px;
            color: white;
            margin: 10px 0px;
            text-decoration: none;
          "
          onMouseOver="this.style.backgroundColor='#0466BF'"
          onMouseOut="this.style.backgroundColor='#3381ca'"
        >
          Reset password
        </a>
        <p
          style="
            padding: 0px;
            margin-top: 40px;
            font-size: 0.7rem;
            color: #7e7e7e;
          "
        >
          To receive more help on this issue, please contact our support team at
          support.letmein.com.
        </p>
      </div>
      <div style="text-align: center; margin: 20px 0px">
        <p style="padding: 0px; margin: 0; color: white; font-size: 0.7rem">
          Term of service
        </p>
        <p
          style="
            padding: 0px;
            margin: 0;
            color: white;
            font-size: 0.7rem;
            letter-spacing: 0.8px;
          "
        >
          &copy; Let-me-in 2022
        </p>
      </div>
    </div>
    `, // html body
    };

    transporter.sendMail(option, (err, info) => {
      if (err) {
        console.log('err', err);
        return res.status(200).json({
          RespCode: 400,
          ResMessage: 'bad',
          RespError: err,
        });
      } else {
        console.log('Send', info.response);
        return res.status(200).json({
          RespCode: 200,
          ResMessage: 'good',
        });
      }
    });

    const userId = user.id;

    const findResetUser = await ResetPassword.findOne({
      userId,
    });

    if (findResetUser) {
      findResetUser.word = token;
      await findResetUser.save();
      res.status(201).json({ findResetUser });
    } else {
      const resetPassword = await ResetPassword.create({
        word: token,
        userId,
      });

      res.status(201).json({ resetPassword });
    }
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { word, password, confirmPassword } = req.body;

    const payload = jwt.verify(word, process.env.JWT_SECRET_KEY);
    console.log(payload);

    if (!password) {
      createError('password is require', 400);
    }
    if (password !== confirmPassword) {
      createError('password did not match', 400);
    }

    const resetPassword = await ResetPassword.findOne({
      where: { word },
    });

    // console.log(userId)
    const userId = resetPassword.userId;

    const user = await User.findOne({
      where: { id: userId },
    });
    console.log(user);

    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = hashedPassword;

    await user.save();

    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

// $2a$12$MnedC9lsT3xqDQutZpuEmu902wuwsGNmQpPJWz1N2muCgdOa9Gtyu
