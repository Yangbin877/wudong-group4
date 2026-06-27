import { MidwayConfig } from '@midwayjs/core';
import { DefaultNamingStrategy } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';

class SnakeNamingStrategy extends DefaultNamingStrategy {
  columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
    return customName || snakeCase(propertyName);
  }
  tableName(targetName: string, userSpecifiedName: string): string {
    return userSpecifiedName || snakeCase(targetName);
  }
}

export default {
  koa: {
    port: 3000,
    keys: ['wudong-group4-session-secret'],
  },
  typeorm: {
    dataSource: {
      default: {
        type: 'mysql',
        host: process.env.MYSQL_HOST || '127.0.0.1',
        port: Number(process.env.MYSQL_PORT) || 3306,
        username: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '123456',
        database: process.env.MYSQL_DATABASE || 'wudong_group4',
        synchronize: false,
        logging: false,
        namingStrategy: new SnakeNamingStrategy(),
        entities: ['**/entity/*.entity.ts', '**/entity/*.entity.js'],
      },
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'wudong-group4-secret-key',
    expiresIn: '7d',
  },
} as MidwayConfig;
