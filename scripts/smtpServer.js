const SMTPServer = require('smtp-server').SMTPServer;
const { simpleParser } = require('mailparser');

const server = new SMTPServer({
  authOptional: true,
  onData(stream, session, callback) {
    simpleParser(stream, {}, (err, parsed) => {
      if (err) {
        console.error(err);
        callback(err);
        return;
      }
      console.log(parsed);
      callback(null, 'Message accepted');
    });
  },
});

server.listen(2525, () => {
  console.log('SMTP server is listening on port 2525');
});