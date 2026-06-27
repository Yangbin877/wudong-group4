import { Provide, Inject } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Context } from '@midwayjs/koa';
import { ScenicSpot } from '../entity/scenic-spot.entity';
import { CacheUtil } from '../common/cache-util';
import { parsePage, pageData } from '../common/result';

@Provide()
export class ScenicSpotService {
  @InjectEntityModel(ScenicSpot)
  repo: Repository<ScenicSpot>;

  @Inject()
  cacheUtil: CacheUtil;

  @Inject()
  ctx: Context;

  cacheKey(page: number, pageSize: number, keyword: string) {
    return `scenic:spot:list:${page}:${pageSize}:${keyword || 'all'}`;
  }

  async list(query: any) {
    const { page, pageSize, skip } = parsePage(query);
    const keyword = query.keyword || '';
    const cacheKey = this.cacheKey(page, pageSize, keyword);

    const cached = await this.cacheUtil.get(cacheKey);
    if (cached) return cached;

    const where: any = { isDeleted: 0 };
    if (keyword) {
      where.name = Like(`%${keyword}%`);
    }

    const [list, total] = await this.repo.findAndCount({
      where,
      order: { id: 'DESC' },
      skip,
      take: pageSize,
    });

    const result = pageData(total, page, pageSize, list);
    await this.cacheUtil.set(cacheKey, result, 300);
    return result;
  }

  async detail(id: number) {
    const cacheKey = `scenic:spot:detail:${id}`;
    const cached = await this.cacheUtil.get(cacheKey);
    if (cached) return cached;

    const data = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (data) await this.cacheUtil.set(cacheKey, data, 300);
    return data;
  }

  async create(body: any) {
    const entity = this.repo.create(body);
    const saved = await this.repo.save(entity);
    await this.cacheUtil.delPattern('scenic:spot:list:*');
    return saved;
  }

  async update(id: number, body: any) {
    await this.repo.update({ id }, { ...body, updatedAt: new Date() });
    await this.cacheUtil.delPattern('scenic:spot:*');
    return this.repo.findOne({ where: { id } });
  }

  async delete(id: number) {
    await this.repo.update({ id }, { isDeleted: 1, updatedAt: new Date() });
    await this.cacheUtil.delPattern('scenic:spot:*');
    return true;
  }
}
