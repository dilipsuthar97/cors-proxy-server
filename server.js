// server.js

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3001; // You can change this if needed

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Proxy endpoint
app.all('/proxy/*', async (req, res) => {
  try {
    // Get target URL after /proxy/
    const targetUrl = req.originalUrl.replace('/proxy/', 'https://ezarapp.com/');

    console.log('targetUrl: ', targetUrl);

    // Forward the request to the actual Magento API
    const response = await axios({
      method: req.method,
      url: targetUrl,
      headers: {
        // ...req.headers,
        Accept: 'application/json',
        host: 'ezarapp.com',
      },
      data: req.body,
      params: req.query,
    });

    console.log('response: ', response.status);

    res.status(response.status).json(response.data);
  } catch (err) {
    console.error('Proxy error:', err.message);
    if (err.response) {
      res.status(err.response.status).send(err.response.data);
    } else {
      res.status(500).send('Something went wrong');
    }
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Proxy server running at http://localhost:${PORT}`);
});

// const express = require('express');
// const httpProxy = require('http-proxy-middleware');

// const app = express();
// const PORT = 3001; // Proxy Server Port
// const TARGET_SERVER = 'https://ezarapp.com'; // Replace with your main server URL

// // Middleware to log requests
// app.use((req, res, next) => {
//     console.log(`Proxying request: ${req.method} ${req.url}`);
//     next();
// });

// // Proxy setup
// const { createProxyMiddleware } = require('http-proxy-middleware');

// app.use(
//     '/proxy', // Route to proxy (adjust if needed)
//     createProxyMiddleware({
//         target: TARGET_SERVER,
//         changeOrigin: true,
//         pathRewrite: { '^/proxy': '' }, // Removes "/api" prefix before forwarding
//         onProxyReq: (proxyReq, req, res) => {
//             console.log(`Forwarding: ${req.method} ${req.url} -> ${TARGET_SERVER}`);
//         },
//         on: {
//           proxyRes: (pres, req, res) => {
//             console.log(res);
//           }
//         }
//     })
// );

// app.listen(PORT, () => {
//     console.log(`Proxy server running at http://localhost:${PORT}`);
// });
