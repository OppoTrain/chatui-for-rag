// // // next.config.js

// const { createProxyMiddleware } = require('http-proxy-middleware');

// module.exports = {
//   async rewrites() {
//     return [
//       {
//         source: '/summarize', // the frontend route (used in the frontend to access the backend)
//         destination: 'http://3.229.58.122:8000/summarize' // the backend route over HTTP
//       },
//       {
//         source: '/synthesize', // the frontend route (used in the frontend to access the new backend)
//         destination: 'http://18.212.147.154:8000/synthesize' // the new backend route over HTTP
//       }
//     ];
//   },
//   webpack: (config, { isServer }) => {
//     if (!isServer) {
//       // Apply the proxy middleware only to the client-side requests
//       config.devServer = {
//         ...config.devServer,
//         proxy: {
//           '/summarize': {
//             target: 'http://3.229.58.122:8000', // backend HTTP server
//             changeOrigin: true,
//             secure: false,
//           },
//           '/synthesize': {
//             target: 'http://18.212.147.154:8000', // new backend HTTP server
//             changeOrigin: true,
//             secure: false,
//           }
//         }
//       };
//     }
//     return config;
//   },
// };
// next.config.js

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = {
  async rewrites() {
    return [
      {
        source: '/summarize', // the frontend route (used in the frontend to access the backend)
        destination: 'http://3.229.58.122:8000/summarize' // the backend route over HTTP
      },
      {
        source: '/synthesize', // the frontend route (used in the frontend to access the new backend)
        destination: 'http://3.226.60.99:8000/synthesize' // the new backend route over HTTP
      }
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Apply the proxy middleware only to the client-side requests
      config.devServer = {
        ...config.devServer,
        proxy: {
          '/summarize': {
            target: 'http://3.229.58.122:8000', // backend HTTP server
            changeOrigin: true,
            secure: false,
          },
          '/synthesize': {
            target: 'http://3.226.60.99:8000', // new backend HTTP server
            changeOrigin: true,
            secure: false,
          }
        }
      };
    }
    return config;
  },
};