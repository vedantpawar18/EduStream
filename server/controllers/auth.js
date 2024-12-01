const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { registerEmailParams } = require('../helpers/email');

const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try { 
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        error: "Email is taken",
      });
    }
 
    const token = jwt.sign({ name, email, password }, process.env.JWT_ACCOUNT_ACTIVATION, {
      expiresIn: "10m",
    }); 
    const params = registerEmailParams(email, token);  
    const sendEmailCommand = new SendEmailCommand(params);
    const data = await sesClient.send(sendEmailCommand); 
    console.log("Email submitted to SES", data);
    res.json({
      message: `Email has been sent to ${email}, Follow the instructions to complete your registration`,
    });
  } catch (error) {
    console.log("Error during registration:", error);
    res.json({
      error: `We could not verify your email. Please try again`,
    });
  }
};
