import { Configuration, App, Inject } from '@midwayjs/decorator';
import * as koa from '@midwayjs/koa';
import * as info from '@midwayjs/info';
import * as typeorm from '@midwayjs/typeorm';
import * as validate from '@midwayjs/validate';
import { join } from 'path';
import { CacheUtil } from './common/cache-util';
import * as jwt from 'jsonwebtoken';

@Configuration({
  imports: [koa, info, typeorm, validate],
  importConfigs: [join(__dirname, './config')],
})
export class MainConfiguration {
  @App()
  app: koa.Application;

  @Inject()
  cacheUtil: CacheUtil;

  async onReady() {
    await this.cacheUtil.init();

    // JWT 鉴权中间件（内联注册）
    const jwtSecret = process.env.JWT_SECRET || 'wudong-group4-secret-key';
    const publicPaths = [
      '/api/admin/login',
      '/api/scenic-spot/list',
      '/api/scenic-spot/detail',
      '/api/ticket-type/list',
      '/api/ticket-type/detail',
      '/api/route-package/list',
      '/api/route-package/detail',
      '/api/health',
    ];
    this.app.use(async (ctx, next) => {
      const isPublic = publicPaths.some(p => ctx.path === p || ctx.path.startsWith(p + '/'));
      if (isPublic) return await next();

      const authHeader = ctx.get('Authorization') || '';
      const token = authHeader.replace(/^Bearer\s+/i, '');
      if (!token) {
        ctx.status = 401;
        ctx.body = { code: 401, message: '未登录', data: null };
        return;
      }
      try {
        const decoded = jwt.verify(token, jwtSecret) as any;
        ctx.state.admin = decoded;
        await next();
      } catch (err) {
        ctx.status = 401;
        ctx.body = { code: 401, message: 'token 无效或已过期', data: null };
      }
    });
    // 全局异常处理
    this.app.use(async (ctx, next) => {
      try {
        await next();
      } catch (err: any) {
        ctx.status = err.status || 500;
        ctx.body = {
          code: err.status || 500,
          message: err.message || '服务器错误',
          data: null,
        };
      }
    });

    // 跨域
    this.app.use(async (ctx, next) => {
      ctx.set('Access-Control-Allow-Origin', '*');
      ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      if (ctx.method === 'OPTIONS') {
        ctx.status = 204;
      } else {
        await next();
      }
    });
  }
}
