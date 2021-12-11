const { createHash } = require('crypto');

function hash(input) {
    return createHash('sha256').update(input).digest('hex');
}

const password = '123456';
const hash1 = hash(password);

console.log(hash1);
