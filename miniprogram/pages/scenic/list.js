const { getScenicSpotList } = require('../../utils/request');

Page({
  data: { list: [], loading: true, page: 1, pageSize: 10, total: 0, keyword: '' },
  onLoad() { this.fetchData(); },
  onKeyword(e) { this.setData({ keyword: e.detail.value }); },
  onSearch() { this.setData({ page: 1 }); this.fetchData(); },
  prevPage() { if (this.data.page > 1) { this.setData({ page: this.data.page - 1 }); this.fetchData(); } },
  nextPage() { this.setData({ page: this.data.page + 1 }); this.fetchData(); },
  // 新增：点击跳转到详情页
  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/scenic/detail?id=' + id
    })
  },
  async fetchData() {
    this.setData({ loading: true });
    try {
      const res = await getScenicSpotList({ page: this.data.page, pageSize: this.data.pageSize, keyword: this.data.keyword });
      this.setData({ list: res.data.list || [], total: res.data.total || 0 });
    } finally { this.setData({ loading: false }); }
  },
});