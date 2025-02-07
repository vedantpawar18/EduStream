exports.registerEmailParams = (email, token) => {
  return {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: [process.env.EMAIL_TO],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
                        <html>
                            <h1>Vefiry your email address</h1>
                            <p>Please use the following link to complete your registration:</p>
                            <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                        </html>
                    `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Complete your registration",
      },
    },
  };
};

exports.forgotPasswordEmailParams = (email, token) => {
  return {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: [process.env.EMAIL_FROM],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
                        <html>
                            <h1>Reset Password Link</h1>
                            <p>Please use the following link to reset your password:</p>
                            <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                        </html>
                    `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Password reset link",
      },
    },
  };
};

exports.linkPublishedParams = (email, data) => {
  return {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: [process.env.EMAIL_FROM],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
            <html style="font-family: Arial, sans-serif; background-color: #f4f7fa; padding: 20px;">
              <body style="background-color: #f4f7fa; color: #333; font-size: 16px;">
                <table style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; padding: 20px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <tr>
                    <td style="text-align: center; padding-bottom: 20px;">
                      <h1 style="color: #333; font-size: 24px; font-weight: 600;">New Link Published</h1>
                      <p style="color: #555; font-size: 18px; margin: 10px 0;">A new link titled <strong>${
                        data.title
                      }</strong> has just been published.</p>
                    </td>
                  </tr>
                  
                  <tr>
                    <td>
                      <p style="font-size: 16px; color: #555;">This link is categorized under the following:</p>
                    </td>
                  </tr>
                  
                  <tr>
                    <td>
                      ${data.categories
                        .map((c) => {
                          return `
                            <div style="margin-bottom: 20px; padding: 15px; background-color: #fafafa; border-radius: 8px;">
                              <h2 style="color: #007bff; font-size: 20px; font-weight: 500;">${c.name}</h2>
                              <img src="${c.image.url}" alt="${c.name}" style="height: 50px; border-radius: 8px; margin-bottom: 10px;" />
                              <h3 style="margin: 0;"><a href="${process.env.CLIENT_URL}/links/${c.slug}" style="text-decoration: none; color: #007bff;">Check it out!</a></h3>
                            </div>
                          `;
                        })
                        .join("")}
                    </td>
                  </tr>
                  
                  <tr>
                    <td style="padding-top: 20px;">
                      <p style="font-size: 16px; color: #555;">If you no longer wish to receive notifications about new links in these categories, you can turn them off by updating your preferences in your <strong><a href="${
                        process.env.CLIENT_URL
                      }/user/profile/update" style="color: #007bff; text-decoration: none;">dashboard</a></strong>.</p>
                    </td>
                  </tr>
                  
                  <tr>
                    <td style="text-align: center; padding-top: 20px;">
                      <p style="font-size: 14px; color: #aaa;">If you have any questions or need assistance, feel free to <a href="mailto:${
                        process.env.EMAIL_FROM
                      }" style="color: #007bff; text-decoration: none;">contact us</a>.</p>
                    </td>
                  </tr>
                </table>
              </body>
            </html>
          `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: `New Link Published: ${data.title}`,
      },
    },
  };
};
