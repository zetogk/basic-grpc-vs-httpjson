'use strict';

const path = require('path');

const { error, log } = console;

const axios = require('axios');
const download = require('download');
const GRPCClient = require('node-grpc-client');
const Hapi = require('@hapi/hapi');
const moment = require('moment');
const mongoose = require('mongoose');

const PROTO_PATH = path.resolve(__dirname, './encode.proto');

const {
    MONGO_URL
} = process.env;

mongoose.connect(MONGO_URL, {useNewUrlParser: true});
const EncodeModel = mongoose.model('Encode', {
    user: String,
    imageUrl: String,
    httpTime: Number,
    grpcTime: Number,
    byteSize: String,
    encodeString: String
});

const init = async () => {

    const server = Hapi.server({
        port: process.env.NODE_HTTP_REST || 3000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with'],
            },
        }
    });

    server.route({
        method: 'POST',
        path:'/encode',
        handler: async (request, h) => {

            try {

                /* GENERIC PROCESS */
                const { user, imageUrl, encodeString } = request.payload;
                log('PAYLOAD::: ', request.payload);
                const imageData = await download(imageUrl);
                const base64Image = Buffer.from(imageData, 'binary').toString('base64');
                const encodeCharsToUse = encodeString == '' ? 'abxz' : encodeString;
                const encodeChars = encodeCharsToUse.split('');
                /* GENERIC PROCESS */

                /* HTTP+JSON PROCESS */
                let initialMoment = new moment();
                let durationHTTP = -1;
                let endMoment = -1;
                try {
                    
                    await axios.post('http://localhost:3001', {
                        b64str: base64Image,
                        chars: encodeChars
                    });

                    endMoment = new moment();
                    durationHTTP = endMoment.diff(initialMoment);

                } catch (err) {

                    error('HTTP request has failed: ', err)
                    
                }
                
                /* HTTP+JSON PROCESS */


                /* GRPC+Protobuf PROCESS */
                const grpcClient = new GRPCClient(PROTO_PATH, 'encoderPkg', 'EncoderSvc', 'localhost:3002');
                const dataToSend = {
                    b64str: base64Image,
                    chars: encodeChars
                };
                initialMoment = new moment()
                await grpcClient.encodeSync(dataToSend);
                endMoment = new moment();
                const durationGRPC = endMoment.diff(initialMoment);
                /* GRPC+Protobuf PROCESS */

                log('durationHTTP::: ', durationHTTP);
                log('durationGRPC::: ', durationGRPC);

                const encodeObject = {
                    user,
                    imageUrl,
                    encodeString,
                    httpTime: durationHTTP,
                    grpcTime: durationGRPC,
                    byteSize: base64Image.length
                };

                /* DATABASE PROCESS */
                const encodeRecord = new EncodeModel(encodeObject);
                await encodeRecord.save();
                /* DATABASE PROCESS */

                console.log('ENCODE OBJECT: ', encodeObject);
                return encodeObject;
                
            } catch (err) {

                console.error('ERROR::: ', err.message);
                
            }
            
        }
    });

    server.route({
        method: 'GET',
        path:'/encode/{user}',
        handler: async (request, h) => {

            try {

                const { user } = request.params;
                console.log('PARAMS::: ', request.params);

                const encodeRecords = await EncodeModel.find({ user }).exec();

                console.log('ENCODE RECORDS: ', encodeRecords);
                return encodeRecords;
                
            } catch (err) {

                console.error('ERROR::: ', err);
                
            }
            
        }
    });

    await server.start();
    console.log('Server running on %ss', server.info.uri);
};

init();
