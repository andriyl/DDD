const { getPayloadMask } = require('./utils');
const operations = {
  create: (api, payload) => api.create(payload),
  async read(api, payload) {
    const { name, mask } = getPayloadMask(payload);
    const [ entity ] = (await api.find(mask)).data;
    const { data, target } = await api.read(entity.id);
    return { name, data, target, mask, entityId: entity.id };
  },
  async find(api, payload) {
    const { name, mask } = getPayloadMask(payload);
    const { data, target } = await api.find(mask);
    return { name, data, target, mask };
  },
  async update(api, payload) {
    const { name, mask } = getPayloadMask(payload);
    const [ entity ] = (await api.find(mask)).data;
    payload[name] = 'updated'+ mask;
    return api.update(entity.id, payload);
  },
  async delete(api, payload) {
    const { mask } = getPayloadMask(payload);
    const [ entity ] = (await api.find(mask)).data;
    return api.delete(entity.id);
  }
}

module.exports = { operations };
