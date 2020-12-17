const express = require('express');
require('dotenv').config();
const axios = require('axios').default;

let cacheObject = {
    data: [],
    valid_until: 0
};

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.all('/*', (req, res) => {
    const originalUrl = req.originalUrl;

    const recipient = originalUrl.split('/')[1];

    const recipientURL = process.env[recipient];

    if ((originalUrl === `/${process.env.CACHE_ENDPOINT}` || originalUrl === `/${process.env.CACHE_ENDPOINT}/`) 
        && (req.method === process.env.CACHE_METHOD) 
        && (cacheObject.data.length > 0)
        && (Date.now() < cacheObject.valid_until)) { 
            res.status(200).json(cacheObject.data);
    } else {
        if (recipientURL) {
            const config = {
                method: req.method,
                url: `${recipientURL}${originalUrl}`,
                ...(Object.keys(req.body || {}).length > 0 && {data: req.body})
            };

            axios(config)
                .then((response) => {
                    if ((originalUrl === `/${process.env.CACHE_ENDPOINT}` || originalUrl === `/${process.env.CACHE_ENDPOINT}/`) 
                        && (req.method === process.env.CACHE_METHOD)) {
                            cacheObject.data = response.data;
                            let date = new Date();
                            date.setMinutes(date.getMinutes() + Number(process.env.CACHE_MINUTES)); 
                            cacheObject.valid_until = +date;
                        };
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
    }
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});