const Mali = require('mali');
const path = require('path');

const { encode } = require('./encoder.js');

const PROTO_PATH = path.resolve(__dirname, './encode.proto');

const {
    NODE_GRPC_ENCODER_PORT
} = process.env;

async function encodeMethod(ctx) {

    try {

        const { b64str, chars } = ctx.req;
        const newb64 = encode(b64str, chars)

        ctx.res = {
            newb64
        };

    } catch (err) {

        error(`error@service.js:encodeB64`, err.message);
        ctx.res = {
            status: 'error',
            message: err.message,
            error: ''
        };

    }

}

function main() {
    const app = new Mali(PROTO_PATH, 'EncoderSvc')
    app.use({
        encode: encodeMethod
    });
    app.start(`0.0.0.0:${NODE_GRPC_ENCODER_PORT}`);
}

main();
