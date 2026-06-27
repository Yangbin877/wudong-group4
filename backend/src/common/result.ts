export interface ApiResult {
  code: number;
  message: string;
  data: any;
}

export function success(data: any = null, message = 'success'): ApiResult {
  return { code: 200, message, data };
}

export function error(message = '服务器错误', code = 500): ApiResult {
  return { code, message, data: null };
}

export function pageData(total: number, page: number, pageSize: number, list: any[]) {
  return { total, page, pageSize, list };
}

export function parsePage(query: any) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(query.pageSize, 10) || 20));
  return { page, pageSize, skip: (page - 1) * pageSize };
}
