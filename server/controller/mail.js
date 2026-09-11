const nodeMailer = require("nodemailer");
require("dotenv").config();

const transporter = nodeMailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === "true", // false pour le port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

exports.sendEmail = async (title, email, name, message, action) => {
  console.log("Sending email to:", email);
console.log("FROM:", process.env.EMAIL_HOST);
  try {
    const mailOption = {
      from:`"Blog App" <ged.user.application@gmail.com>`,
      to: email,
      importance: "high",
      subject: "Blog " + title,
      html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="X-UA-Compatible" content="ie=edge" />
            <title>Blog</title>

            <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
            rel="stylesheet"
            />
        </head>
        <body
            style="
            margin: 0;
            font-family: 'Poppins', sans-serif;
            background: #ffffff;
            font-size: 14px;
            "
        >
            <div
            style="
                max-width: 720px;
                margin: 0 auto;
                padding: 45px 20px 60px;
                background: #f4f7ff;
                background-image: url(https://github.com/shuvra-matrix/images/blob/main/542362-abstract-3D-gradient-blue-orange.jpg?raw=true);
                background-repeat: no-repeat;
                background-size: 800px 452px;
                background-position: top center;
                font-size: 14px;
                color: #434343;
            "
            >
            <header>
                <table style="width: 100%">
                <tbody>
                    <tr style="height: 0">
                    <td
                        style="
                        display: flex;
                        flex-flow: nowrap row;
                        justify-content: center;
                        align-items: center;
                        "
                    >
                        <img
                        alt=""
                        src="https://github.com/shuvra-matrix/images/blob/main/blogsmall.png?raw=true"
                        height="40px"
                        /><span
                        style="
                            font-size: 1.4rem;
                            color: rgb(255, 255, 255);
                            font-weight: 700;
                        "
                        >Blog</span
                        >
                    </td>
                    </tr>
                </tbody>
                </table>
            </header>

            <main>
        <div
          style="
            margin: 0;
            margin-top: 70px;
            padding: 70px 15px 80px;
            background: #ffffff;
            border-radius: 30px;
            text-align: center;
          "
        >
          <div style="width: 100%; max-width: 500px; margin: 0 auto">
            <h1
              style="
                margin: 0;
                font-size: 24px;
                font-weight: 500;
                color: #1f1f1f;
              "
            >
              ${title}
            </h1>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-size: 16px;
                font-weight: 500;
              "
            >
              Hey ${name},
            </p>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-weight: 500;
                letter-spacing: 0.56px;
              "
            >
              ${message}
            </p>
           ${action}
        
           
            <p
              style="
                margin: 0;
                margin-top: 20px;
                font-weight: 500;
                letter-spacing: 0.56px;
                color: #1f1f1f !important;
              "
            >
              Thank you for choosing Blog. We look forward to providing you
              with a seamless and secure experience.
            </p>
          </div>
        </div>
      </main>

      <footer
        style="
          width: 100%;
          max-width: 490px;
          margin: 20px auto 0;
          text-align: center;
          border-top: 1px solid #e6ebf1;
        "
      >
         <div style="margin: 16px auto 0px; width: 100%">
          <p
            style="
              margin: 8px auto 0px;
              width: 100%;
              text-align: center;
              font-size: 16px;
              font-weight: 600;
              color: #434343;
              padding-top: 5px;
              padding-bottom: 5px;
            "
          >
            Blog
          </p>
          <p
            style="
              margin: 8px auto 0px;
              width: 100%;
              text-align: center;
              color: #434343;
              padding-bottom: 5px;
            "
          >
            Tunisia
          </p>
          <p
            style="
              margin: 8px auto 0px;
              width: 100%;
              text-align: center;
              text-align: center;
            "
          >
            Copyright © 2025. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  </body>
</html>
`,
    };
    const info=await transporter.sendMail(mailOption);
    console.log("Email sent successfully:", info);
    return true;
  } catch (error) {
    console.error("Email not sent:", error);
    return error;
  }
};
