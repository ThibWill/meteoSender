const crypto = require('crypto');

const hash = async (data) => {
  const hash = crypto.createHash('sha256');
  hash.update(data);
  hash.update('little0bit1of9salt');
  return hash.digest('hex')
}

module.exports = {
  hash: hash
}