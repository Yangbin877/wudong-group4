import request from '../utils/request';

export function login(username: string, password: string) {
  return request.post('/admin/login', { username, password });
}

export function getScenicSpotList(params: any) {
  return request.get('/scenic-spot/list', { params });
}
export function createScenicSpot(data: any) {
  return request.post('/scenic-spot/create', data);
}
export function updateScenicSpot(id: number, data: any) {
  return request.post(`/scenic-spot/update/${id}`, data);
}
export function deleteScenicSpot(id: number) {
  return request.post(`/scenic-spot/delete/${id}`);
}

export function getTicketTypeList(params: any) {
  return request.get('/ticket-type/list', { params });
}
export function createTicketType(data: any) {
  return request.post('/ticket-type/create', data);
}
export function updateTicketType(id: number, data: any) {
  return request.post(`/ticket-type/update/${id}`, data);
}
export function deleteTicketType(id: number) {
  return request.post(`/ticket-type/delete/${id}`);
}

export function getRoutePackageList(params: any) {
  return request.get('/route-package/list', { params });
}
export function getRoutePackageDetail(id: number) {
  return request.get(`/route-package/detail/${id}`);
}
export function createRoutePackage(data: any) {
  return request.post('/route-package/create', data);
}
export function updateRoutePackage(id: number, data: any) {
  return request.post(`/route-package/update/${id}`, data);
}
export function deleteRoutePackage(id: number) {
  return request.post(`/route-package/delete/${id}`);
}

export function getElectronicTicketList(params: any) {
  return request.get('/electronic-ticket/list', { params });
}
export function deleteElectronicTicket(id: number) {
  return request.post(`/electronic-ticket/delete/${id}`);
}

export function getTicketInventoryList(params: any) {
  return request.get('/ticket-inventory/list', { params });
}
export function batchUpdateInventory(items: any[]) {
  return request.post('/ticket-inventory/batch-update', { items });
}
