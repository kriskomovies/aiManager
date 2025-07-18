import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoriesController } from './inventories.controller';
import { InventoriesService } from './inventories.service';
import { InventoryRepository } from '../../database/repositories/inventory.repository';
import { InventoryTransactionRepository } from '../../database/repositories/inventory-transaction.repository';
import { InventoryEntity } from '../../database/entities/inventory.entity';
import { InventoryTransactionEntity } from '../../database/entities/inventory-transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([InventoryEntity, InventoryTransactionEntity]),
  ],
  controllers: [InventoriesController],
  providers: [
    InventoriesService,
    InventoryRepository,
    InventoryTransactionRepository,
  ],
  exports: [
    InventoriesService,
    InventoryRepository,
    InventoryTransactionRepository,
  ],
})
export class InventoriesModule {}
