import { Middleware, IMiddleware } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import * as jwt from 'jsonwebtoken';

@Middleware()
export class JwtMiddleware implements IMiddleware<Context, any> {
  resolve() {
    return async (ctx: Context, next: () => Promise<any>) => {
      const publicPaths = [
        '/api/admin/login',
        '/api/scenic-spot/list',
        '/api/scenic-spot/detail',
        '/api/ticket-type/list',
        '/api/route-package/list',
        '/api/route-package/detail',
        '/api/health',
      ];
      const isPublic = publicPaths.some(p => ctx.path === p || ctx.path.startsWith(p + '/'));
      if (isPublic) {
        return await next();
      }

      const authHeader = ctx.get('Authorization') || '';
      const token = authHeader.replace(/^Bearer\s+/i, '');
      if (!token) {
        ctx.status = 401;
        ctx.body = { code: 401, message: '未登录', data: null };
        return;
      }

      try {
        const secret = ctx.app.getConfig('jwt.secret');
        const decoded = jwt.verify(token, secret) as any;
        ctx.state.admin = decoded;
        await next();
      } catch (err) {
        ctx.status = 401;
        ctx.body = { code: 401, message: 'token 无效或已过期', data: null };
      }
    };
  }

  static getName(): string {
    return 'jwt';
  }
}
