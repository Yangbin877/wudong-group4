const BASE = 'http://localhost:3000';

export function request(url, method = 'GET', data = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE + url,
      method,
      data,
      header: { 'Content-Type': 'application/json' },
      success: (res) => {
        if (res.data && res.data.code === 200) {
          resolve(res.data);
        } else {
          wx.showToast({ title: (res.data && res.data.message) || '请求失败', icon: 'none' });
          reject(res.data);
        }
      },
      fail: (err) => {
        wx.showToast({ title: '网络错误', icon: 'none' });
        reject(err);
      },
    });
  });
}

export function getScenicSpotList(params) {
  return request('/api/scenic-spot/list?' + toQuery(params));
}

export function getScenicSpotDetail(id) {
  return request('/api/scenic-spot/detail/' + id);
}

export function getTicketTypeList(params) {
  return request('/api/ticket-type/list?' + toQuery(params));
}

export function getRoutePackageList(params) {
  return request('/api/route-package/list?' + toQuery(params));
}

export function getRoutePackageDetail(id) {
  return request('/api/route-package/detail/' + id);
}

export function createElectronicTicket(data) {
  return request('/api/electronic-ticket/create', 'POST', data);
}

function toQuery(obj) {
  const parts = [];
  for (const k in obj) {
    if (obj[k] != null) parts.push(k + '=' + encodeURIComponent(obj[k]));
  }
  return parts.join('&');
}
