import { Provide, Inject } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, Like } from 'typeorm';
import { TicketType } from '../entity/ticket-type.entity';
import { CacheUtil } from '../common/cache-util';
import { parsePage, pageData } from '../common/result';

@Provide()
export class TicketTypeService {
  @InjectEntityModel(TicketType)
  repo: Repository<TicketType>;

  @Inject()
  cacheUtil: CacheUtil;

  cacheKey(page: number, pageSize: number, scenicSpotId: number, keyword: string) {
    return `ticket:type:list:${page}:${pageSize}:${scenicSpotId || 0}:${keyword || 'all'}`;
  }

  async list(query: any) {
    const { page, pageSize, skip } = parsePage(query);
    const keyword = query.keyword || '';
    const scenicSpotId = query.scenicSpotId ? Number(query.scenicSpotId) : 0;

    const ck = this.cacheKey(page, pageSize, scenicSpotId, keyword);
    const cached = await this.cacheUtil.get(ck);
    if (cached) return cached;

    const where: any = { isDeleted: 0 };
    if (keyword) where.name = Like(`%${keyword}%`);
    if (scenicSpotId > 0) where.scenicSpotId = scenicSpotId;

    const [list, total] = await this.repo.findAndCount({
      where,
      relations: ['scenicSpot'],
      order: { id: 'DESC' },
      skip,
      take: pageSize,
    });

    const result = pageData(total, page, pageSize, list);
    await this.cacheUtil.set(ck, result, 300);
    return result;
  }

  async detail(id: number) {
    return this.repo.findOne({ where: { id, isDeleted: 0 }, relations: ['scenicSpot'] });
  }

  async create(body: any) {
    const entity = this.repo.create(body);
    const saved = await this.repo.save(entity);
    await this.cacheUtil.delPattern('ticket:type:list:*');
    return saved;
  }

  async update(id: number, body: any) {
    await this.repo.update({ id }, { ...body, updatedAt: new Date() });
    await this.cacheUtil.delPattern('ticket:type:*');
    return this.repo.findOne({ where: { id } });
  }

  async delete(id: number) {
    await this.repo.update({ id }, { isDeleted: 1, updatedAt: new Date() });
    await this.cacheUtil.delPattern('ticket:type:*');
    return true;
  }
}
