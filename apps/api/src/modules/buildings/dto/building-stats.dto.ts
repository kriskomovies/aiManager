import { ApiProperty } from '@nestjs/swagger';

export class BuildingStatsDto {
  @ApiProperty({
    description: 'Building ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  buildingId: string;

  @ApiProperty({
    description: 'Building name',
    example: 'Sunset Apartments',
  })
  buildingName: string;

  @ApiProperty({
    description: 'Total number of units',
    example: 24,
  })
  totalUnits: number;

  @ApiProperty({
    description: 'Number of occupied units',
    example: 20,
  })
  occupiedUnits: number;

  @ApiProperty({
    description: 'Number of vacant units',
    example: 4,
  })
  vacantUnits: number;

  @ApiProperty({
    description: 'Occupancy rate percentage',
    example: 83.33,
  })
  occupancyRate: number;

  @ApiProperty({
    description: 'Monthly rental income',
    example: 48000,
  })
  monthlyRevenue: number;

  @ApiProperty({
    description: 'Annual rental income',
    example: 576000,
  })
  annualRevenue: number;

  @ApiProperty({
    description: 'Whether the building is fully occupied',
    example: false,
  })
  isFullyOccupied: boolean;

  @ApiProperty({
    description: 'Whether tax can be generated',
    example: true,
  })
  canGenerateTax: boolean;

  @ApiProperty({
    description: 'Next tax generation date',
    example: '2024-02-01T00:00:00Z',
  })
  nextTaxDate: Date;
}
