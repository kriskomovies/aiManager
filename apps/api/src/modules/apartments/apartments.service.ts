import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApartmentEntity } from '../../database/entities/apartment.entity';
import { ResidentEntity } from '../../database/entities/resident.entity';
import { ApartmentRepository } from '../../database/repositories/apartment.repository';
import { BuildingRepository } from '../../database/repositories/building.repository';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import {
  UpdateApartmentDto,
  UpdateResidentDto,
} from './dto/update-apartment.dto';
import { ApartmentQueryDto } from './dto/apartment-query.dto';
import { ApartmentStatsDto } from './dto/apartment-stats.dto';
import { IPaginatedResult } from '../../common/abstracts/base-repository.abstract';
import { ApartmentStatus } from '@repo/interfaces';

@Injectable()
export class ApartmentsService {
  constructor(
    private readonly apartmentRepository: ApartmentRepository,
    private readonly buildingRepository: BuildingRepository,
    @InjectRepository(ResidentEntity)
    private readonly residentRepository: Repository<ResidentEntity>,
  ) {}

  async createApartment(
    createApartmentDto: CreateApartmentDto,
  ): Promise<ApartmentEntity> {
    // Verify building exists
    const building = await this.buildingRepository.findById(
      createApartmentDto.buildingId,
    );
    if (!building) {
      throw new NotFoundException(
        `Building with ID ${createApartmentDto.buildingId} not found`,
      );
    }

    // Check if apartment number already exists in the building
    const existingApartment =
      await this.apartmentRepository.existsByNumberAndBuilding(
        createApartmentDto.number,
        createApartmentDto.buildingId,
      );
    if (existingApartment) {
      throw new ConflictException(
        `Apartment number ${createApartmentDto.number} already exists in building ${building.name}`,
      );
    }

    // Validate residents count matches provided residents
    if (
      createApartmentDto.residents &&
      createApartmentDto.residents.length > 0
    ) {
      if (
        createApartmentDto.residentsCount !==
        createApartmentDto.residents.length
      ) {
        throw new BadRequestException(
          'Residents count does not match the number of provided residents',
        );
      }

      // Validate that only one resident can be main contact
      const mainContacts = createApartmentDto.residents.filter(
        (r) => r.isMainContact,
      );
      if (mainContacts.length > 1) {
        throw new BadRequestException(
          'Only one resident can be the main contact',
        );
      }
    }

    // Transform DTO to entity data
    const apartmentData: Partial<ApartmentEntity> = {
      buildingId: createApartmentDto.buildingId,
      type: createApartmentDto.type,
      number: createApartmentDto.number,
      floor: createApartmentDto.floor,
      quadrature: createApartmentDto.quadrature,
      commonParts: createApartmentDto.commonParts,
      idealParts: createApartmentDto.idealParts,
      residentsCount: createApartmentDto.residentsCount,
      pets: createApartmentDto.pets,
      invoiceEnabled: createApartmentDto.invoiceEnabled,
      blockForPayment: createApartmentDto.blockForPayment,
      cashierNote: createApartmentDto.cashierNote,
      monthlyRent: createApartmentDto.monthlyRent,
      maintenanceFee: createApartmentDto.maintenanceFee,
      status: ApartmentStatus.VACANT, // Default status
      debt: 0, // Default debt
    };

    // Create apartment
    const apartment = await this.apartmentRepository.create(apartmentData);

    // Create residents if provided
    if (
      createApartmentDto.residents &&
      createApartmentDto.residents.length > 0
    ) {
      const residents = createApartmentDto.residents.map((residentDto) => ({
        apartmentId: apartment.id,
        name: residentDto.name,
        surname: residentDto.surname,
        phone: residentDto.phone,
        email: residentDto.email,
        role: residentDto.role,
        isMainContact: residentDto.isMainContact,
      }));

      await this.residentRepository.save(residents);
    }

    return await this.findById(apartment.id);
  }

  async findById(id: string): Promise<ApartmentEntity> {
    const apartment = await this.apartmentRepository.findById(id);
    if (!apartment) {
      throw new NotFoundException(`Apartment with ID ${id} not found`);
    }
    return apartment;
  }

  async findByBuildingId(buildingId: string): Promise<ApartmentEntity[]> {
    // Verify building exists
    const building = await this.buildingRepository.findById(buildingId);
    if (!building) {
      throw new NotFoundException(`Building with ID ${buildingId} not found`);
    }

    return await this.apartmentRepository.findByBuildingId(buildingId);
  }

  async findAllApartments(
    queryDto: ApartmentQueryDto,
  ): Promise<IPaginatedResult<ApartmentEntity>> {
    return await this.apartmentRepository.findAllWithFilters(queryDto);
  }

  async updateApartment(
    id: string,
    updateApartmentDto: UpdateApartmentDto,
  ): Promise<ApartmentEntity> {
    // Check if apartment exists
    await this.findById(id);

    // If updating apartment number, check for conflicts
    if (updateApartmentDto.number) {
      const apartment = await this.apartmentRepository.findById(id);
      const existingApartment =
        await this.apartmentRepository.existsByNumberAndBuilding(
          updateApartmentDto.number,
          apartment!.buildingId,
          id,
        );
      if (existingApartment) {
        throw new ConflictException(
          `Apartment number ${updateApartmentDto.number} already exists in this building`,
        );
      }
    }

    // Handle residents update if provided
    if (updateApartmentDto.residents) {
      await this.updateApartmentResidents(id, updateApartmentDto.residents);

      // Update residents count to match actual residents
      updateApartmentDto.residentsCount = updateApartmentDto.residents.length;
    }

    // Extract residents from updateData to avoid TypeORM issues
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { residents, ...apartmentUpdateData } = updateApartmentDto;

    const updated = await this.apartmentRepository.update(
      id,
      apartmentUpdateData,
    );
    if (!updated) {
      throw new NotFoundException(`Apartment with ID ${id} not found`);
    }
    return updated;
  }

  /**
   * Updates apartment residents with CRUD operations
   * - Existing residents (with ID) are updated
   * - New residents (without ID) are created
   * - Missing residents are deleted
   */
  private async updateApartmentResidents(
    apartmentId: string,
    residentsData: UpdateResidentDto[],
  ): Promise<void> {
    // Validate that only one resident can be main contact
    const mainContacts = residentsData.filter((r) => r.isMainContact);
    if (mainContacts.length > 1) {
      throw new BadRequestException(
        'Only one resident can be the main contact',
      );
    }

    // Get current residents
    const currentResidents = await this.residentRepository.find({
      where: { apartmentId },
    });

    // Extract IDs from the update data (existing residents)
    const updateResidentIds = residentsData
      .filter((r) => r.id)
      .map((r) => r.id!);

    // Find residents to delete (not in the update data)
    const residentsToDelete = currentResidents.filter(
      (resident) => !updateResidentIds.includes(resident.id),
    );

    // Delete residents that are no longer needed
    if (residentsToDelete.length > 0) {
      await this.residentRepository.remove(residentsToDelete);
    }

    // Process each resident in the update data
    for (const residentData of residentsData) {
      if (residentData.id) {
        // Update existing resident
        const existingResident = currentResidents.find(
          (r) => r.id === residentData.id,
        );
        if (existingResident) {
          await this.residentRepository.update(residentData.id, {
            name: residentData.name,
            surname: residentData.surname,
            phone: residentData.phone,
            email: residentData.email,
            role: residentData.role,
            isMainContact: residentData.isMainContact,
          });
        }
      } else {
        // Create new resident
        const newResident = this.residentRepository.create({
          apartmentId,
          name: residentData.name,
          surname: residentData.surname,
          phone: residentData.phone,
          email: residentData.email,
          role: residentData.role,
          isMainContact: residentData.isMainContact,
        });
        await this.residentRepository.save(newResident);
      }
    }
  }

  async deleteApartment(id: string): Promise<void> {
    const exists = await this.apartmentRepository.exists(id);
    if (!exists) {
      throw new NotFoundException(`Apartment with ID ${id} not found`);
    }

    const deleted = await this.apartmentRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Failed to delete apartment with ID ${id}`);
    }
  }

  async getApartmentStats(buildingId?: string): Promise<ApartmentStatsDto> {
    // Get status counts
    const statusCounts =
      await this.apartmentRepository.countByStatus(buildingId);
    const totalApartments = Object.values(statusCounts).reduce(
      (sum, count) => sum + count,
      0,
    );

    // Get financial data
    const totalDebt = await this.apartmentRepository.getTotalDebt(buildingId);
    const totalMonthlyRevenue =
      await this.apartmentRepository.getTotalRevenue(buildingId);

    // Get apartment details for calculations
    const queryDto: ApartmentQueryDto = { buildingId, limit: 1000 }; // Get all apartments
    const apartmentsResult =
      await this.apartmentRepository.findAllWithFilters(queryDto);
    const apartments = apartmentsResult.data;

    // Calculate statistics
    const totalQuadrature = apartments.reduce(
      (sum, apt) => sum + apt.quadrature,
      0,
    );
    const averageQuadrature =
      totalApartments > 0 ? totalQuadrature / totalApartments : 0;

    const apartmentsWithRent = apartments.filter(
      (apt) => apt.monthlyRent && apt.monthlyRent > 0,
    );
    const totalRent = apartmentsWithRent.reduce(
      (sum, apt) => sum + (apt.monthlyRent || 0),
      0,
    );
    const averageRent =
      apartmentsWithRent.length > 0 ? totalRent / apartmentsWithRent.length : 0;

    const totalResidents = apartments.reduce(
      (sum, apt) => sum + apt.residentsCount,
      0,
    );
    const totalPets = apartments.reduce((sum, apt) => sum + apt.pets, 0);
    const apartmentsWithDebt = apartments.filter(
      (apt) => apt.debt && apt.debt > 0,
    ).length;

    const occupiedApartments = statusCounts[ApartmentStatus.OCCUPIED] || 0;
    const vacantApartments = statusCounts[ApartmentStatus.VACANT] || 0;
    const maintenanceApartments =
      statusCounts[ApartmentStatus.MAINTENANCE] || 0;
    const reservedApartments = statusCounts[ApartmentStatus.RESERVED] || 0;

    const occupancyRate =
      totalApartments > 0 ? (occupiedApartments / totalApartments) * 100 : 0;

    return {
      totalApartments,
      occupiedApartments,
      vacantApartments,
      maintenanceApartments,
      reservedApartments,
      occupancyRate: Math.round(occupancyRate * 100) / 100, // Round to 2 decimal places
      totalDebt,
      totalMonthlyRevenue,
      averageQuadrature: Math.round(averageQuadrature * 100) / 100,
      totalQuadrature,
      apartmentsWithDebt,
      averageRent: Math.round(averageRent * 100) / 100,
      totalResidents,
      totalPets,
    };
  }

  async updateApartmentStatus(
    id: string,
    status: ApartmentStatus,
  ): Promise<ApartmentEntity> {
    return await this.updateApartment(id, { status });
  }

  async addDebt(id: string, amount: number): Promise<ApartmentEntity> {
    const apartment = await this.findById(id);
    const currentDebt = apartment.debt || 0;
    const newDebt = currentDebt + amount;

    return await this.updateApartment(id, { debt: newDebt });
  }

  async payDebt(id: string, amount: number): Promise<ApartmentEntity> {
    const apartment = await this.findById(id);
    const currentDebt = apartment.debt || 0;

    if (amount > currentDebt) {
      throw new BadRequestException(
        'Payment amount cannot exceed current debt',
      );
    }

    const newDebt = Math.max(0, currentDebt - amount);
    return await this.updateApartment(id, { debt: newDebt });
  }
}
