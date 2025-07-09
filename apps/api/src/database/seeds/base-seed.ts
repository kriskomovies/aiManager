import { AppDataSource } from '../../config/typeorm.config';

export abstract class BaseSeed {
  abstract run(): Promise<void>;

  protected async getRepository(entity: any) {
    return AppDataSource.getRepository(entity);
  }
}
