import { Provide, Inject } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { TicketInventory } from '../entity/ticket-inventory.entity';
import { parsePage, pageData } from '../common/result';

@Provide()
export class TicketInventoryService {
  @InjectEntityModel(TicketInventory)
  repo: Repository<TicketInventory>;

  async list(query: any) {
    const { page, pageSize, skip } = parsePage(query);
    const ticketTypeId = query.ticketTypeId ? Number(query.ticketTypeId) : 0;
    const dateFrom = query.dateFrom || '';
    const dateTo = query.dateTo || '';

    const where: any = { isDeleted: 0 };
    if (ticketTypeId > 0) where.ticketTypeId = ticketTypeId;

    const qb = this.repo.createQueryBuilder('inv')
      .leftJoinAndSelect('inv.ticketType', 'tt')
      .where('inv.isDeleted = 0');

    if (ticketTypeId > 0) qb.andWhere('inv.ticketTypeId = :ticketTypeId', { ticketTypeId });
    if (dateFrom) qb.andWhere('inv.inventoryDate >= :dateFrom', { dateFrom });
    if (dateTo) qb.andWhere('inv.inventoryDate <= :dateTo', { dateTo });

    const [list, total] = await qb
      .orderBy('inv.inventoryDate', 'ASC')
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    return pageData(total, page, pageSize, list);
  }

  async getByTicketTypeAndDate(ticketTypeId: number, date: string) {
    return this.repo.findOne({
      where: { ticketTypeId, inventoryDate: date as any, isDeleted: 0 },
      relations: ['ticketType'],
    });
  }

  async batchUpdate(items: Array<{ ticketTypeId: number; date: string; stock: number }>) {
    for (const item of items) {
      const existing = await this.repo.findOne({
        where: { ticketTypeId: item.ticketTypeId, inventoryDate: item.date as any, isDeleted: 0 },
      });
      if (existing) {
        await this.repo.update({ id: existing.id }, { stock: item.stock, updatedAt: new Date() });
      } else {
        await this.repo.save(this.repo.create({
          ticketTypeId: item.ticketTypeId,
          inventoryDate: item.date as any,
          stock: item.stock,
          sold: 0,
        }));
      }
    }
    return true;
  }
}
