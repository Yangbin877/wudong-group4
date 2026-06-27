const { getScenicSpotDetail, getTicketTypeList } = require('../../utils/request');

Page({
  data: {
    spot: null,
    tickets: [],
    loading: true
  },

  onLoad(options) {
    // 接收列表页传过来的景区id
    const id = Number(options.id);
    if (id && !isNaN(id)) {
      this.fetchData(id);
    } else {
      wx.showToast({
        title: '参数异常',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  async fetchData(id) {
    this.setData({ loading: true });
    try {
      // 并发请求：景区详情 + 当前景区所有票种
      const [sRes, tRes] = await Promise.all([
        getScenicSpotDetail(id),
        getTicketTypeList({ scenicSpotId: id, page: 1, pageSize: 50 })
      ]);

      // 接口成功才赋值
      if (sRes.code === 200) {
        this.setData({
          spot: sRes.data
        });
      }
      if (tRes.code === 200) {
        this.setData({
          tickets: tRes.data.list || []
        });
      }
    } catch (err) {
      // 网络/接口异常兜底
      wx.showToast({
        title: '数据加载失败',
        icon: 'none'
      });
      console.error('详情页请求错误：', err);
    } finally {
      this.setData({ loading: false });
    }
  }
});