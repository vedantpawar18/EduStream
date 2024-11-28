// Import the required classes from AWS SDK v3
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

// Set up the AWS SES client with credentials
const sesClient = new SESClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
     const region= process.env.AWS_REGION  
    const params = {
        Source: process.env.EMAIL_FROM,
        Destination: {
            ToAddresses: [email]
        },
        ReplyToAddresses: [process.env.EMAIL_TO],
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: `<html><body><h1>Hello ${name}</h1 style="color:red;"><p>Test email</p></body></html>`
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Complete your registration'
            }
        }
    };

    try { 
        const sendEmailCommand = new SendEmailCommand(params); 
        const data = await sesClient.send(sendEmailCommand);
        
        console.log('Email submitted to SES:', data);
        res.send('Email sent');
    } catch (error) {
        console.log('Error sending email on register:', error);
        res.send('Email failed');
    }
};
