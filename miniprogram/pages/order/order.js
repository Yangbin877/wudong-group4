const { createElectronicTicket } = require('../../utils/request');

Page({
  data: {
    ticketTypeId: 0, routePackageId: 0, isRoute: false,
    date: '', quantity: 1, phone: '',
    result: null, submitting: false,
  },
  onLoad(options) {
    if (options.ticketTypeId) {
      this.setData({ ticketTypeId: Number(options.ticketTypeId), isRoute: false });
    } else if (options.routePackageId) {
      this.setData({ routePackageId: Number(options.routePackageId), isRoute: true });
    }
  },
  onDateChange(e) { this.setData({ date: e.detail.value }); },
  onQty(e) { this.setData({ quantity: Number(e.detail.value) || 1 }); },
  onPhone(e) { this.setData({ phone: e.detail.value }); },
  async onSubmit() {
    const { date, phone, ticketTypeId, routePackageId, isRoute, quantity } = this.data;
    if (!date || !phone) { wx.showToast({ title: '请填写完整信息', icon: 'none' }); return; }
    this.setData({ submitting: true });
    try {
      const body = { quantity, validStart: date, validEnd: date };
      if (isRoute) { body.routePackageId = routePackageId; } else { body.ticketTypeId = ticketTypeId; }
      const res = await createElectronicTicket(body);
      if (res.code === 200) { this.setData({ result: res.data }); } else { wx.showToast({ title: res.message, icon: 'none' }); }
    } catch { wx.showToast({ title: '提交失败', icon: 'none' }); }
    finally { this.setData({ submitting: false }); }
  },
});
