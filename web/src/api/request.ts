import axios from 'axios';

const request = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

request.interceptors.response.use(
  (res) => {
    if (res.data.code !== 200) {
      alert(res.data.message || '请求失败');
    }
    return res.data;
  },
  (err) => {
    alert('网络错误: ' + err.message);
    return Promise.reject(err);
  },
);

export default request;
