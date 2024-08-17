const city = db('city');
city.find = async (mask) => {
  const sql = 'SELECT id, name from city where name like $1';
  return await city.query(sql, [mask]);
};
(city);
