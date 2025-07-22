import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MonthlyFeeEntity } from '../entities/monthly-fee.entity';
@Injectable()
export class MonthlyFeeRepository {
  constructor(
    @InjectRepository(MonthlyFeeEntity)
    private readonly repository: Repository<MonthlyFeeEntity>,
  ) {}

  async create(
    createData: Partial<MonthlyFeeEntity>,
  ): Promise<MonthlyFeeEntity> {
    const monthlyFee = this.repository.create(createData);
    return await this.repository.save(monthlyFee);
  }

  async findById(id: string): Promise<MonthlyFeeEntity | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['apartments', 'apartments.apartment'],
    });
  }

  async findAll(): Promise<MonthlyFeeEntity[]> {
    return await this.repository.find({
      order: { createdAt: 'DESC' },
      relations: ['apartments'],
    });
  }

  async findByBuildingId(buildingId: string): Promise<MonthlyFeeEntity[]> {
    return await this.repository.find({
      where: { buildingId, isActive: true },
      order: { createdAt: 'DESC' },
      relations: ['apartments', 'apartments.apartment'],
    });
  }

  async update(
    id: string,
    updateData: Partial<MonthlyFeeEntity>,
  ): Promise<MonthlyFeeEntity | null> {
    await this.repository.update(id, updateData);
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async softDelete(id: string): Promise<boolean> {
    return (await this.update(id, { isActive: false })) !== null;
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.repository.count({ where: { id } });
    return count > 0;
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }

  async countByBuilding(buildingId: string): Promise<number> {
    return await this.repository.count({
      where: { buildingId, isActive: true },
    });
  }
}
