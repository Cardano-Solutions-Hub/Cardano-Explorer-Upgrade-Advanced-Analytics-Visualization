import { createProxyMiddleware } from 'http-proxy-middleware';
import BASEURL from '../constants.js';

// eslint-disable-next-line consistent-return
const serverProxy = async (req, res, next) => {
  try {
    // create the proxy
    return createProxyMiddleware({
      target: `${BASEURL}`,
      changeOrigin: true,
      logger: console,
      // eslint-disable-next-line no-shadow
      pathRewrite: (path, req) => {
        let requestQury = '';
        // eslint-disable-next-line no-restricted-syntax, guard-for-in
        for (const query in req.query) {
          requestQury += `${query}=${req.query[query]}&`;
        }
        // Rewrite the URL to include the dynamic request parameter (e.g., blocks.json)
        return `${req.params[0]}?${requestQury}`; // Forward it to the target API
      },
    })(req, res, next);
  } catch (e) {
    console.log(`Error: ${e}`);
  }
};

export default serverProxy;
