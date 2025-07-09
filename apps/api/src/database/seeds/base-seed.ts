import { AppDataSource } from '../../config/typeorm.config';
import { EntityTarget, ObjectLiteral } from 'typeorm';

export abstract class BaseSeed {
  abstract run(): Promise<void>;

  protected async getRepository(entity: EntityTarget<ObjectLiteral>) {
    return AppDataSource.getRepository(entity);
  }
}
