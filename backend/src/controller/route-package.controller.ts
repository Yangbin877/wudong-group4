import { Inject, Controller, Get, Post, Body, Param, Query } from '@midwayjs/decorator';
import { RoutePackageService } from '../service/route-package.service';
import { success, error } from '../common/result';

@Controller('/api/route-package')
export class RoutePackageController {
  @Inject()
  service: RoutePackageService;

  @Get('/list')
  async list(@Query() query: any) {
    const data = await this.service.list(query);
    return success(data);
  }

  @Get('/detail/:id')
  async detail(@Param('id') id: number) {
    const data = await this.service.detail(id);
    if (!data) return error('路线套餐不存在', 404);
    return success(data);
  }

  @Post('/create')
  async create(@Body() body: any) {
    if (!body.name) return error('名称不能为空', 400);
    const data = await this.service.create(body);
    return success(data, '创建成功');
  }

  @Post('/update/:id')
  async update(@Param('id') id: number, @Body() body: any) {
    const data = await this.service.update(id, body);
    return success(data, '更新成功');
  }

  @Post('/delete/:id')
  async delete(@Param('id') id: number) {
    await this.service.delete(id);
    return success(null, '删除成功');
  }
}
