import { Inject, Controller, Get, Post, Body, Param, Query } from '@midwayjs/decorator';
import { ElectronicTicketService } from '../service/electronic-ticket.service';
import { success, error } from '../common/result';

@Controller('/api/electronic-ticket')
export class ElectronicTicketController {
  @Inject()
  service: ElectronicTicketService;

  @Get('/list')
  async list(@Query() query: any) {
    const data = await this.service.list(query);
    return success(data);
  }

  @Get('/detail/:id')
  async detail(@Param('id') id: number) {
    const data = await this.service.detail(id);
    if (!data) return error('电子票不存在', 404);
    return success(data);
  }

  @Post('/create')
  async create(@Body() body: any) {
    if (!body.ticketTypeId && !body.routePackageId) {
      return error('票种ID或路线套餐ID不能同时为空', 400);
    }
    const result: any = await this.service.create(body);
    if (result.error) return error(result.message, 400);
    return success(result, '出票成功');
  }

  @Post('/verify')
  async verify(@Body() body: any) {
    if (!body.qrCode) return error('二维码不能为空', 400);
    const result: any = await this.service.verify(body.qrCode);
    if (result.error) return error(result.message, 400);
    return success(result, '核销成功');
  }

  @Post('/delete/:id')
  async delete(@Param('id') id: number) {
    await this.service.delete(id);
    return success(null, '删除成功');
  }

  @Post('/update/:id')
  async update(@Param('id') id: number, @Body() body: any) {
    const data = await this.service.update(id, body);
    return success(data, '更新成功');
  }
}
