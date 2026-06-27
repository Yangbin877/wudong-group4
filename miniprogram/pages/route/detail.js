const { getRoutePackageDetail } = require('../../utils/request');

Page({
  data: { pkg: null, itineraries: [], loading: true },
  onLoad(options) {
    const id = Number(options.id);
    if (id) this.fetchData(id);
  },
  async fetchData(id) {
    this.setData({ loading: true });
    try {
      const res = await getRoutePackageDetail(id);
      const data = res.data || {};
      this.setData({
        pkg: {
          ...data,
          tags: typeof data.tags === 'string' ? JSON.parse(data.tags) : (data.tags || []),
        },
        itineraries: data.itineraries || [],
      });
    } finally { this.setData({ loading: false }); }
  },
});
