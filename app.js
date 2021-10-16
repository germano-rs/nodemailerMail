const express = require("express");
const app = express();
app.use(express.json());
const nodemailer = require("nodemailer");
//change the config.example.json file informing your credentials and save it as config.json
const { host, port, user, pass } = require("./config.json");
let transporter = nodemailer.createTransport({
    host,
    port,
    secure: true,
    auth: {
      user,
      pass,
    },
  });

  //checking SMTP configuration
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
      res.status(400).send({ error: false, message: error });
    } else {
      console.log("Server is ready to take our messages.");
    }
  });

app.post("/", async (req, res) => {
  const { from, to, subject, text, html } = req.body;
  async function main() {
    //connect to a SMTP server

    // send mail with defined transport object
    transporter.sendMail(
      {
        from,
        to,
        subject,
        text,
        html,
      },
      (err) => {
        if (err) {
          console.log(err);
          res.status(400).send({ error: true, message: err });
        }
        res
          .status(200)
          .send({ error: false, message: "The email has been sent" });
      }
    );
  }
  main().catch(console.error);
});

app.listen(8080, () => {
  console.log("Server started on port 8080.");
});
