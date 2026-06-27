import { Inject, Controller, Get, Post, Body } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { AdminService } from '../service/admin.service';
import { success, error } from '../common/result';

@Controller('/api/admin')
export class AdminController {
  @Inject()
  ctx: Context;

  @Inject()
  service: AdminService;

  @Post('/login')
  async login(@Body() body: any) {
    if (!body.username || !body.password) {
      return error('用户名和密码不能为空', 400);
    }
    const result = await this.service.login(body.username, body.password);
    if (result.error) return error(result.message, 401);
    return success(result, '登录成功');
  }

  @Get('/info')
  async info() {
    const admin = this.ctx.state.admin;
    if (!admin) return error('未登录', 401);
    const user = await this.service.info(admin.id);
    return success(user);
  }
}

@Controller('/api/health')
export class HealthController {
  @Get('/')
  async health() {
    return success({ version: '1.0.0', timestamp: new Date().toISOString() });
  }
}
