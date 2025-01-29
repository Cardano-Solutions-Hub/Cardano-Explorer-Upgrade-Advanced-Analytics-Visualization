import express from 'express';
import serverProxy from '../controller/proxyServer.controller.js';
import {tokenDistribution, getDailyStats, getActiveAccounts} from '../controller/analysis.controller.js';

const router = express.Router();

router.post('/rest/v1/token-distribution', tokenDistribution);
router.get('/rest/v1/daily-stats', getDailyStats);
router.get('/rest/v1/active-accounts', getActiveAccounts)
router.use('/rest/v1/*', serverProxy);

export default router;
