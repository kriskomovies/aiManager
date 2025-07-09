import { ApiProperty } from '@nestjs/swagger';

export class ApartmentStatsDto {
  @ApiProperty({
    description: 'Total number of apartments',
    example: 48,
  })
  totalApartments: number;

  @ApiProperty({
    description: 'Number of occupied apartments',
    example: 45,
  })
  occupiedApartments: number;

  @ApiProperty({
    description: 'Number of vacant apartments',
    example: 3,
  })
  vacantApartments: number;

  @ApiProperty({
    description: 'Number of apartments under maintenance',
    example: 0,
  })
  maintenanceApartments: number;

  @ApiProperty({
    description: 'Number of reserved apartments',
    example: 0,
  })
  reservedApartments: number;

  @ApiProperty({
    description: 'Occupancy rate as percentage',
    example: 93.75,
  })
  occupancyRate: number;

  @ApiProperty({
    description: 'Total debt across all apartments',
    example: 1500.5,
  })
  totalDebt: number;

  @ApiProperty({
    description: 'Total monthly revenue potential',
    example: 38400,
  })
  totalMonthlyRevenue: number;

  @ApiProperty({
    description: 'Average apartment size in square meters',
    example: 85.3,
  })
  averageQuadrature: number;

  @ApiProperty({
    description: 'Total quadrature of all apartments',
    example: 4094.4,
  })
  totalQuadrature: number;

  @ApiProperty({
    description: 'Number of apartments with debt',
    example: 5,
  })
  apartmentsWithDebt: number;

  @ApiProperty({
    description: 'Average monthly rent',
    example: 800,
  })
  averageRent: number;

  @ApiProperty({
    description: 'Total number of residents',
    example: 127,
  })
  totalResidents: number;

  @ApiProperty({
    description: 'Total number of pets',
    example: 23,
  })
  totalPets: number;
}
