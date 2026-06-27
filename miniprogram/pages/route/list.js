const { getRoutePackageList } = require('../../utils/request');

Page({
  data: { list: [], loading: true, page: 1, pageSize: 10, total: 0, keyword: '' },
  onLoad() { this.fetchData(); },
  onKeyword(e) { this.setData({ keyword: e.detail.value }); },
  onSearch() { this.setData({ page: 1 }); this.fetchData(); },
  prevPage() { if (this.data.page > 1) { this.setData({ page: this.data.page - 1 }); this.fetchData(); } },
  nextPage() { this.setData({ page: this.data.page + 1 }); this.fetchData(); },
  async fetchData() {
    this.setData({ loading: true });
    try {
      const res = await getRoutePackageList({ page: this.data.page, pageSize: this.data.pageSize, keyword: this.data.keyword });
      const list = (res.data.list || []).map(item => ({
        ...item,
        tags: typeof item.tags === 'string' ? JSON.parse(item.tags) : (item.tags || []),
      }));
      this.setData({ list, total: res.data.total || 0 });
    } finally { this.setData({ loading: false }); }
  },
});
