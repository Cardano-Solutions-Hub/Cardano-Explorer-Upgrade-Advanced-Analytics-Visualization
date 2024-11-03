const BASE_URL = 'http://localhost:5000/rest/v1'

const EPOCH_API = `${BASE_URL}/epochs.json?rows=true`;
const BLOCK_API = `${BASE_URL}/blocks.json?rows=true`;
const TOKEN_API = `${BASE_URL}/tokens.json?rows=true`;
const TRANSACTION_API = `${BASE_URL}/transactions.json?rows=true`;

export {BASE_URL, EPOCH_API, BLOCK_API, TOKEN_API, TRANSACTION_API};