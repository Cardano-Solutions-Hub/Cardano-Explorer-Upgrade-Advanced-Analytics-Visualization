import URL from '../constants'

const BASE_URL = `${URL}/rest/v1`

const EPOCH_API = `${BASE_URL}/epochs.json?rows=true`;
const BLOCK_API = `${BASE_URL}/blocks`;
const TOKEN_API = `${BASE_URL}/tokens`;
const TRANSACTION_API = `${BASE_URL}/transactions`;
const ACCOUNT_API = `${BASE_URL}/accounts`;
const POOL_API = `${BASE_URL}/pools`;

export {BASE_URL, EPOCH_API, BLOCK_API, TOKEN_API, TRANSACTION_API, ACCOUNT_API, POOL_API};