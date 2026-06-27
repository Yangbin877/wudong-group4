import { Inject, Controller, Get, Post, Body, Query } from '@midwayjs/decorator';
import { TicketInventoryService } from '../service/ticket-inventory.service';
import { success, error } from '../common/result';

@Controller('/api/ticket-inventory')
export class TicketInventoryController {
  @Inject()
  service: TicketInventoryService;

  @Get('/list')
  async list(@Query() query: any) {
    const data = await this.service.list(query);
    return success(data);
  }

  @Post('/batch-update')
  async batchUpdate(@Body() body: any) {
    if (!body.items || !Array.isArray(body.items)) {
      return error('items 必须为数组', 400);
    }
    await this.service.batchUpdate(body.items);
    return success(null, '库存更新成功');
  }
}
