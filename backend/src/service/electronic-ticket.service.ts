import { Provide, Inject } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { ElectronicTicket } from '../entity/electronic-ticket.entity';
import { TicketInventory } from '../entity/ticket-inventory.entity';
import { parsePage, pageData } from '../common/result';
import { v4 as uuidv4 } from 'uuid';

@Provide()
export class ElectronicTicketService {
  @InjectEntityModel(ElectronicTicket)
  repo: Repository<ElectronicTicket>;

  @InjectEntityModel(TicketInventory)
  invRepo: Repository<TicketInventory>;

  async list(query: any) {
    const { page, pageSize, skip } = parsePage(query);
    const where: any = { isDeleted: 0 };
    const [list, total] = await this.repo.findAndCount({
      where,
      relations: ['ticketType', 'routePackage'],
      order: { id: 'DESC' },
      skip,
      take: pageSize,
    });
    return pageData(total, page, pageSize, list);
  }

  async create(body: any) {
    const { ticketTypeId, routePackageId, validStart, validEnd, quantity = 1 } = body;

    // 库存检查
    if (ticketTypeId) {
      const inventory = await this.invRepo.findOne({
        where: { ticketTypeId, inventoryDate: validStart, isDeleted: 0 },
      });
      if (!inventory || inventory.stock - inventory.sold < quantity) {
        return { error: true, message: '当日库存不足' };
      }
      await this.invRepo.update(
        { ticketTypeId, inventoryDate: validStart },
        { sold: () => `sold + ${quantity}` },
      );
    }

    const entity = this.repo.create({
      ...body,
      qrCode: uuidv4(),
      orderNo: `WD${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    });
    return this.repo.save(entity);
  }

  async detail(id: number) {
    return this.repo.findOne({
      where: { id, isDeleted: 0 },
      relations: ['ticketType', 'routePackage'],
    });
  }

  async verify(qrCode: string) {
    const ticket = await this.repo.findOne({ where: { qrCode, isDeleted: 0 } });
    if (!ticket) return { error: true, message: '电子票不存在' };
    if (ticket.status === 1) return { error: true, message: '已核销' };
    if (ticket.status === 3) return { error: true, message: '已退款' };
    if (ticket.validEnd && new Date(ticket.validEnd) < new Date()) {
      await this.repo.update({ id: ticket.id }, { status: 2 });
      return { error: true, message: '已过期' };
    }
    await this.repo.update({ id: ticket.id }, { status: 1, usedAt: new Date() });
    return { success: true, message: '核销成功', ticket };
  }

  async delete(id: number) {
    await this.repo.update({ id }, { isDeleted: 1 });
    return true;
  }

  async update(id: number, body: any) {
    await this.repo.update({ id }, { ...body, updatedAt: new Date() });
    return this.repo.findOne({ where: { id }, relations: ['ticketType', 'routePackage'] });
  }
}
