'use strict';

const rp = require('request-promise');
const {WATERMARK_BOT_TOKEN} = process.env;

async function sendToUser(chat_id, text) {
    const options = {
        method: 'GET',
        uri: `https://api.telegram.org/bot${WATERMARK_BOT_TOKEN}/sendMessage`,
        qs: {
            chat_id,
            text
        }
    };

    return rp(options);
}

module.exports.watermarkBot = async event => {
    const body = JSON.parse(event.body);
    const {chat, text} = body.message;

    await sendToUser(chat.id, `Your text is ${text}`);

    return {statusCode: 200};
};

// Use this code if you don't use the http event with the LAMBDA-PROXY integration
// return { message: 'Go Serverless v1.0! Your function executed successfully!', event };

