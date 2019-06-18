'use strict';

const Hapi = require('@hapi/hapi');
const { encode } = require("./encoder")

const init = async () => {

    const server = Hapi.server({
        port: process.env.NODE_HTTP_ENCODER || 3001,
        host: 'localhost'
    });

    server.route({
        method: 'POST',
        path:'/',
        handler: (request, h) => {

            const { b64str, chars } = request.payload;
            const newb64 = encode(b64str, chars);
            return newb64;
            
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();

// server.listen()

  // download('http://unicorn.com/foo.jpg').then(data => {
      //  fs.writeFileSync('dist/foo.jpg', data);
    // });