import { Provide, Inject } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, Like } from 'typeorm';
import { RoutePackage } from '../entity/route-package.entity';
import { RouteItinerary } from '../entity/route-itinerary.entity';
import { CacheUtil } from '../common/cache-util';
import { parsePage, pageData } from '../common/result';

@Provide()
export class RoutePackageService {
  @InjectEntityModel(RoutePackage)
  repo: Repository<RoutePackage>;

  @InjectEntityModel(RouteItinerary)
  itiRepo: Repository<RouteItinerary>;

  @Inject()
  cacheUtil: CacheUtil;

  async list(query: any) {
    const { page, pageSize, skip } = parsePage(query);
    const keyword = query.keyword || '';
    const ck = `route:pkg:list:${page}:${pageSize}:${keyword || 'all'}`;
    const cached = await this.cacheUtil.get(ck);
    if (cached) return cached;

    const where: any = { isDeleted: 0 };
    if (keyword) where.name = Like(`%${keyword}%`);

    const [list, total] = await this.repo.findAndCount({
      where,
      order: { id: 'DESC' },
      skip,
      take: pageSize,
    });

    const result = pageData(total, page, pageSize, list);
    await this.cacheUtil.set(ck, result, 300);
    return result;
  }

  async detail(id: number) {
    const ck = `route:pkg:detail:${id}`;
    const cached = await this.cacheUtil.get(ck);
    if (cached) return cached;

    const data = await this.repo.findOne({ where: { id, isDeleted: 0 } });
    if (!data) return null;

    const itineraries = await this.itiRepo.find({
      where: { routePackageId: id, isDeleted: 0 },
      order: { dayNo: 'ASC' },
    });

    const result = { ...data, itineraries };
    await this.cacheUtil.set(ck, result, 300);
    return result;
  }

  async create(body: any) {
    const { itineraries, ...pkg } = body;
    const entity = this.repo.create(pkg);
    const saved: any = await this.repo.save(entity);

    if (itineraries?.length) {
      const list = itineraries.map((it: any, i: number) =>
        this.itiRepo.create({ ...it, routePackageId: saved.id, dayNo: it.dayNo || i + 1 }),
      );
      await this.itiRepo.save(list);
    }
    await this.cacheUtil.delPattern('route:pkg:list:*');
    return saved;
  }

  async update(id: number, body: any) {
    const { itineraries, ...pkg } = body;
    await this.repo.update({ id }, { ...pkg, updatedAt: new Date() });

    if (itineraries?.length) {
      await this.itiRepo.update({ routePackageId: id }, { isDeleted: 1 });
      const list = itineraries.map((it: any, i: number) =>
        this.itiRepo.create({ ...it, routePackageId: id, dayNo: it.dayNo || i + 1 }),
      );
      await this.itiRepo.save(list);
    }
    await this.cacheUtil.delPattern('route:pkg:*');
    return this.repo.findOne({ where: { id } });
  }

  async delete(id: number) {
    await this.repo.update({ id }, { isDeleted: 1, updatedAt: new Date() });
    await this.itiRepo.update({ routePackageId: id }, { isDeleted: 1, updatedAt: new Date() });
    await this.cacheUtil.delPattern('route:pkg:*');
    return true;
  }
}
