const { response } = require('express');
const express = require('express');
require('dotenv').config();
const axios = require('axios').default;

const cacheObject = {
    data: [],
    time: Date.now
};

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.all('/*', (req, res) => {
    console.log('original URL', req.originalUrl);
    console.log('method', req.method);
    console.log('body', req.body);

    const recipient = req.originalUrl.split('/')[1];
    console.log('recipient', recipient);

    const recipientURL = process.env[recipient];
    console.log('recipient URL', recipientURL);

    if (recipientURL) {
        const config = {
            method: req.method,
            url: `${recipientURL}${req.originalUrl}`,
            ...(Object.keys(req.body || {}).length > 0 && {data: req.body})
        };
        console.log('axios config', config);

        axios(config)
            .then((response) => {
                console.log('response', response.data);
                res.json(response.data);
            })
            .catch((error) => {
                console.log('error', JSON.stringify(error));;
                if (error.response) {
                    const { status, data } = error.response;
                    res.status(status).json(data);
                } else {
                    res.status(500).json({ error: error.message });
                }
            });
    } else {
        res.status(502).json({ error: 'Cannot process request' });
    }
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});