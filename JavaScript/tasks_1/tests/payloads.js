const { getRandomEntity } = require('./utils');
const payloads = {
  user: {
    login: getRandomEntity('user_'),
    password: 'ypMEd9FwvtlOjcvH94iICQ==:V6LnSOVwXzENxeLCJk59Toadea7oaA1IxYulAOtKkL9tBxjEPOw085vYalEdLDoe8xbrXQlhh7QRGzrSe8Bthw=='
  },
  country: {
    name: getRandomEntity('Brazil_'),
  },
  city: {
    name: getRandomEntity('Lviv_'),
    country: 1
  }
}
module.exports = { payloads };
