import { BuildingEntity } from '../entities/building.entity';
import {
  BuildingType,
  BuildingStatus,
  TaxGenerationPeriod,
} from '@repo/interfaces';
import { BaseSeed } from './base-seed';

export class BuildingSeed extends BaseSeed {
  async run(): Promise<void> {
    const buildingRepository = await this.getRepository(BuildingEntity);

    // Check if seeds already exist
    const existingBuildings = await buildingRepository.count();
    if (existingBuildings > 0) {
      console.log('Buildings already seeded, skipping...');
      return;
    }

    const buildings = [
      {
        name: 'Sunset Apartments',
        type: BuildingType.RESIDENTIAL,
        status: BuildingStatus.ACTIVE,
        city: 'Sofia',
        district: 'Mladost',
        street: 'Aleksandar Malinov',
        number: '78',
        entrance: 'A',
        postalCode: '1712',
        commonPartsArea: 150.5,
        quadrature: 2500,
        parkingSlots: 24,
        basements: 1,
        balance: 15000,
        monthlyFee: 25,
        debt: 500,
        taxGenerationPeriod: TaxGenerationPeriod.MONTHLY,
        taxGenerationDay: 15,
        homebookStartDate: new Date('2024-01-01'),
        invoiceEnabled: true,
        totalUnits: 48,
        occupiedUnits: 45,
        irregularities: 2,
        occupancyRate: 93.75,
        monthlyRevenue: 1200,
        annualRevenue: 14400,
        description: 'Modern residential building with all amenities',
      },
      {
        name: 'Downtown Office Complex',
        type: BuildingType.OFFICE,
        status: BuildingStatus.ACTIVE,
        city: 'Sofia',
        district: 'Center',
        street: 'Vitosha Boulevard',
        number: '42',
        postalCode: '1000',
        commonPartsArea: 200,
        quadrature: 3500,
        parkingSlots: 35,
        basements: 2,
        balance: 25000,
        monthlyFee: 50,
        debt: 0,
        taxGenerationPeriod: TaxGenerationPeriod.MONTHLY,
        taxGenerationDay: 1,
        homebookStartDate: new Date('2023-06-01'),
        invoiceEnabled: true,
        totalUnits: 20,
        occupiedUnits: 18,
        irregularities: 0,
        occupancyRate: 90,
        monthlyRevenue: 2500,
        annualRevenue: 30000,
        description: 'Premium office space in the city center',
      },
      {
        name: 'Green Valley Homes',
        type: BuildingType.RESIDENTIAL,
        status: BuildingStatus.ACTIVE,
        city: 'Sofia',
        district: 'Boyana',
        street: 'Boyana Street',
        number: '12',
        entrance: 'B',
        postalCode: '1616',
        commonPartsArea: 120,
        quadrature: 1800,
        parkingSlots: 16,
        basements: 1,
        balance: 8000,
        monthlyFee: 30,
        debt: 200,
        taxGenerationPeriod: TaxGenerationPeriod.MONTHLY,
        taxGenerationDay: 10,
        homebookStartDate: new Date('2024-03-01'),
        invoiceEnabled: false,
        totalUnits: 32,
        occupiedUnits: 30,
        irregularities: 1,
        occupancyRate: 93.75,
        monthlyRevenue: 960,
        annualRevenue: 11520,
        description: 'Quiet residential area with green spaces',
      },
    ];

    await buildingRepository.save(buildings);
    console.log(`Seeded ${buildings.length} buildings`);
  }
}
