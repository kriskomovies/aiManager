import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/abstracts/base-entity.abstract';
import {
  BuildingType,
  BuildingStatus,
  TaxGenerationPeriod,
} from '@repo/interfaces';

export class BuildingEntity extends BaseEntity {
  @ApiProperty({
    description: 'Building name',
    example: 'Sunset Apartments',
  })
  name: string;

  @ApiProperty({
    description: 'Building address',
    example: '123 Main Street, City, State 12345',
  })
  address: string;

  @ApiProperty({
    description: 'Type of building',
    enum: BuildingType,
    example: BuildingType.RESIDENTIAL,
  })
  type: BuildingType;

  @ApiProperty({
    description: 'Current status of the building',
    enum: BuildingStatus,
    example: BuildingStatus.ACTIVE,
  })
  status: BuildingStatus;

  @ApiProperty({
    description: 'Total number of units/apartments',
    example: 24,
  })
  totalUnits: number;

  @ApiProperty({
    description: 'Number of occupied units',
    example: 20,
  })
  occupiedUnits: number;

  @ApiProperty({
    description: 'Monthly rental income in cents',
    example: 48000,
  })
  monthlyRental: number;

  @ApiProperty({
    description: 'Tax generation period',
    enum: TaxGenerationPeriod,
    example: TaxGenerationPeriod.MONTHLY,
  })
  taxGenerationPeriod: TaxGenerationPeriod;

  @ApiProperty({
    description: 'Date when next tax is due',
    example: '2024-02-01T00:00:00Z',
  })
  nextTaxDate: Date;

  @ApiProperty({
    description: 'Building manager name',
    example: 'John Smith',
    required: false,
  })
  managerName?: string;

  @ApiProperty({
    description: 'Manager contact phone',
    example: '+1234567890',
    required: false,
  })
  managerPhone?: string;

  @ApiProperty({
    description: 'Manager email address',
    example: 'manager@example.com',
    required: false,
  })
  managerEmail?: string;

  @ApiProperty({
    description: 'Additional notes about the building',
    example: 'Recently renovated lobby',
    required: false,
  })
  notes?: string;

  // Business logic methods
  calculateOccupancyRate(): number {
    if (this.totalUnits === 0) return 0;
    return Math.round((this.occupiedUnits / this.totalUnits) * 100);
  }

  calculateMonthlyRevenue(): number {
    return this.monthlyRental;
  }

  calculateAnnualRevenue(): number {
    return this.monthlyRental * 12;
  }

  isFullyOccupied(): boolean {
    return this.occupiedUnits >= this.totalUnits;
  }

  hasVacancies(): boolean {
    return this.occupiedUnits < this.totalUnits;
  }

  getVacantUnits(): number {
    return Math.max(0, this.totalUnits - this.occupiedUnits);
  }

  isActive(): boolean {
    return this.status === BuildingStatus.ACTIVE;
  }

  canGenerateTax(): boolean {
    return this.isActive() && this.nextTaxDate <= new Date();
  }

  updateOccupancy(occupiedUnits: number): void {
    if (occupiedUnits < 0) {
      throw new Error('Occupied units cannot be negative');
    }
    if (occupiedUnits > this.totalUnits) {
      throw new Error('Occupied units cannot exceed total units');
    }
    this.occupiedUnits = occupiedUnits;
  }

  updateNextTaxDate(): void {
    const nextDate = new Date(this.nextTaxDate);

    switch (this.taxGenerationPeriod) {
      case TaxGenerationPeriod.MONTHLY:
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case TaxGenerationPeriod.QUARTERLY:
        nextDate.setMonth(nextDate.getMonth() + 3);
        break;
      case TaxGenerationPeriod.YEARLY:
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
    }

    this.nextTaxDate = nextDate;
  }
}
