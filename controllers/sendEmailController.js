const createError = require('../util/createError');
const { User } = require('../models');

const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL,
  REFRESH_TOKEN,
} = require('../config/constants');

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL,
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

exports.sendEmailForgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      where: { email },
    });
    // console.log(user)
    // console.log(email)

    if (!user) {
      createError("Don't have this user");
    }

    //gen word
    const { createHmac } = await import('node:crypto');
    const secret = 'abcdefg';
    const hash = createHmac('sha256', secret)
      .update('I love cupcakes')
      .digest('hex');
    console.log(hash);

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
      html: `<p>Please click this link below to reset your password.</p>
      <a href="http://localhost:3000/changePassword/${hash}">http://localhost:3000/changePassword/${hash}<a>
      <img
      src=" https://lh3.googleusercontent.com/a-/AOh14GjowlKjYkj0EQqWV0PJTq2CdHHYY5F4RUe86CcH=s96-c"
    />`, // html body
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
  } catch (error) {
    next(error);
  }
};

// exports.sendEmailForgotPassword = async (req, res, next) => {
//   try {

//     const {email} = req.body
//     const user = await User.findOne({
//       where:{email}
//     })
//     console.log(user)

//     if(!user){
//       createError("Don't have this user")
//     }
//     const transporter = nodemailer.createTransport({
//       // host: 'smtp.ethereal.email',
//       // port: 587,
//       // secure: false, // true for 465, false for other ports
//       service:'gmail',
//       auth: {
//         user: "let-me-in@gmail.com", // generated ethereal user
//         pass: "123", // generated ethereal password
//       },
//     });
//     const option = {
//       from: 'let-me-in@gmail.com', // sender address
//       to: 'paruj.lab@gmail.com', // list of receivers
//       subject: 'Change Password', // Subject line
//       text: 'Hello world?', // plain text body
//       html: `<p>Hello world?</p>
//       <img
//       src=" https://lh3.googleusercontent.com/a-/AOh14GjowlKjYkj0EQqWV0PJTq2CdHHYY5F4RUe86CcH=s96-c"
//     />`, // html body
//     };

//     transporter.sendMail(option, (err, info) => {
//       if (err) {
//         console.log('err', err);
//         return res.status(200).json({
//           RespCode: 400,
//           ResMessage: 'bad',
//           RespError: err,
//         });
//       } else {
//         console.log('Send', info.response);
//         return res.status(200).json({
//           RespCode: 200,
//           ResMessage: 'good',
//         });
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };
