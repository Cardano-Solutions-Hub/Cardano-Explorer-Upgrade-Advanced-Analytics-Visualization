import express from 'express';
import serverProxy from '../controller/proxyServer.controller.js';
import tokenDistribution from '../controller/analysis.controller.js';

const router = express.Router();

router.post('/rest/v1/token-distribution', tokenDistribution);
router.use('/rest/v1/*', serverProxy);

export default router;
