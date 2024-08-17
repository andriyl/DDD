const country = db('country');

({
  async create({ name }) {
    return await country.create({ name });
  },

  async read(id) {
    return await country.read(id);
  },

  async find(mask) {
    const sql = 'SELECT * from country where name like $1';
    return await country.query(sql, [mask]);
  },

  async delete(id) {
    return await country.delete(id);
  },

});
