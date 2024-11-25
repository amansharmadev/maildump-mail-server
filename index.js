require('dotenv').config();
const parser = require('mailparser').simpleParser;
const SMTPServer = require("smtp-server").SMTPServer;
const axios = require('axios');

const server = new SMTPServer({
    allowInsecureAuth: true,
    authOptional: true,
    onConnect(session, cb) {
        console.log(session);
        cb();
    },

    onMailFrom(address, session, cb) {
        cb();
    },

    onRcptTo(stream, session, cb) {
        cb();
    },
    async onData(stream, session, cb) {
        parser(stream, {}, (err, parsed) => {

            if (err){
                console.log("Error:" , err)
            }
            sendMailToDomain(parsed);
            cb()
        })
    }
});


function sendMailToDomain ({
    to,
    cc,
    from,
    html,
    text,
    headers,
    date,
    messageId,
    subject,
}) {
    const body = {
        to,
        cc,
        from,
        headers,
        messageId,
        date,
        text,
        subject,
        html,
    };

    axios({
        method: 'POST',
        url: process.env.MAIL_URL,
        data: body,
    })
    .then(() => console.log('Mail posted at', new Date()))
    .catch(err => console.log(err.message));
}


server.listen(
    process.env.PORT,
    () => console.info(`Server listening at port: ${process.env.PORT}`)
);
