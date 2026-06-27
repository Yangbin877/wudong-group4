import request from './request';

export function getScenicSpotList(params: any) {
  return request.get('/scenic-spot/list', { params });
}

export function getScenicSpotDetail(id: number) {
  return request.get(`/scenic-spot/detail/${id}`);
}

export function getTicketTypeList(params: any) {
  return request.get('/ticket-type/list', { params });
}

export function getRoutePackageList(params: any) {
  return request.get('/route-package/list', { params });
}

export function getRoutePackageDetail(id: number) {
  return request.get(`/route-package/detail/${id}`);
}

export function createElectronicTicket(data: any) {
  return request.post('/electronic-ticket/create', data);
}
