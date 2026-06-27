import { Provide, Inject } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { AdminUser } from '../entity/admin-user.entity';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Provide()
export class AdminService {
  @InjectEntityModel(AdminUser)
  repo: Repository<AdminUser>;

  async login(username: string, password: string) {
    const user = await this.repo.findOne({ where: { username, isDeleted: 0 } });
    if (!user) return { error: true, message: '账号或密码错误' };

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return { error: true, message: '账号或密码错误' };

    const secret = process.env.JWT_SECRET || 'wudong-group4-secret-key';
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, secret, { expiresIn: '7d' });

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        role: user.role,
      },
    };
  }

  async info(id: number) {
    return this.repo.findOne({ where: { id, isDeleted: 0 }, select: ['id', 'username', 'nickname', 'role'] });
  }
}
