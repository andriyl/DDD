function getPayloadMask(payload) {
  const name = Object.keys(payload)[0];
  return { name, mask: payload[name] };
}

function getRandomEntity(prefix, length = 8) {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < length; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return prefix + randomString;
}

module.exports = {
  getRandomEntity,
  getPayloadMask
}
