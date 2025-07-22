import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MonthlyFeeEntity } from '../../database/entities/monthly-fee.entity';
import { MonthlyFeeApartmentEntity } from '../../database/entities/monthly-fee-apartment.entity';
import { ApartmentMonthlyPaymentEntity } from '../../database/entities/apartment-monthly-payment.entity';
import { ApartmentEntity } from '../../database/entities/apartment.entity';
import { CreateMonthlyFeeDto } from './dto/create-monthly-fee.dto';
import { MonthlyFeeRepository } from '../../database/repositories/monthly-fee.repository';
import { IBuildingApartmentFeesResponse } from '@repo/interfaces';
import { ResidentEntity } from '../../database/entities/resident.entity';

@Injectable()
export class MonthlyFeesService {
  constructor(
    private readonly monthlyFeeRepository: MonthlyFeeRepository,
    @InjectRepository(MonthlyFeeApartmentEntity)
    private readonly monthlyFeeApartmentRepository: Repository<MonthlyFeeApartmentEntity>,
    @InjectRepository(ApartmentMonthlyPaymentEntity)
    private readonly apartmentMonthlyPaymentRepository: Repository<ApartmentMonthlyPaymentEntity>,
    @InjectRepository(ApartmentEntity)
    private readonly apartmentRepository: Repository<ApartmentEntity>,
  ) {}

  async create(
    createMonthlyFeeDto: CreateMonthlyFeeDto,
  ): Promise<MonthlyFeeEntity> {
    const {
      buildingId,
      name,
      paymentBasis,
      applicationMode,
      baseAmount,
      isDistributedEvenly,
      targetMonth,
      apartments,
    } = createMonthlyFeeDto;

    // Create the monthly fee entity
    const monthlyFee = await this.monthlyFeeRepository.create({
      buildingId,
      name,
      paymentBasis,
      applicationMode,
      baseAmount,
      isDistributedEvenly,
      targetMonth,
      isActive: true,
    });

    // Create apartment fee configurations
    const apartmentFees: MonthlyFeeApartmentEntity[] = [];

    for (const apartmentConfig of apartments) {
      if (apartmentConfig.isSelected) {
        const calculatedAmount = this.calculateApartmentAmount(
          baseAmount,
          applicationMode,
          apartmentConfig.coefficient,
          apartments,
        );

        const apartmentFee = this.monthlyFeeApartmentRepository.create({
          monthlyFeeId: monthlyFee.id,
          apartmentId: apartmentConfig.apartmentId,
          coefficient: apartmentConfig.coefficient,
          calculatedAmount,
          description: apartmentConfig.description,
        });

        apartmentFees.push(apartmentFee);
      }
    }

    await this.monthlyFeeApartmentRepository.save(apartmentFees);

    const result = await this.monthlyFeeRepository.findById(monthlyFee.id);
    if (!result) {
      throw new Error('Failed to retrieve created monthly fee');
    }
    return result;
  }

  async findAll(): Promise<MonthlyFeeEntity[]> {
    return await this.monthlyFeeRepository.findAll();
  }

  async findById(id: string): Promise<MonthlyFeeEntity> {
    const monthlyFee = await this.monthlyFeeRepository.findById(id);
    if (!monthlyFee) {
      throw new NotFoundException(`Monthly fee with ID ${id} not found`);
    }
    return monthlyFee;
  }

  async findByBuildingId(buildingId: string): Promise<MonthlyFeeEntity[]> {
    return await this.monthlyFeeRepository.findByBuildingId(buildingId);
  }

  async remove(id: string): Promise<void> {
    const exists = await this.monthlyFeeRepository.exists(id);
    if (!exists) {
      throw new NotFoundException(`Monthly fee with ID ${id} not found`);
    }
    await this.monthlyFeeRepository.softDelete(id);
  }

  async getApartmentPaymentSummary(apartmentId: string) {
    // Get all fees applicable to this apartment
    const apartmentFees = await this.monthlyFeeApartmentRepository.find({
      where: { apartmentId },
      relations: ['monthlyFee', 'apartment'],
    });

    // Calculate totals
    const totalMonthlyAmount = apartmentFees.reduce(
      (sum, fee) => sum + parseFloat(fee.calculatedAmount.toString()),
      0,
    );

    // Get payment history (for now, return mock data since payments aren't implemented yet)
    const totalPaid = 0; // TODO: Calculate from actual payments
    const totalOwed = totalMonthlyAmount; // TODO: Calculate based on months and payments

    return {
      apartmentId,
      fees: apartmentFees.map((fee) => ({
        id: fee.id,
        name: fee.monthlyFee.name,
        amount: parseFloat(fee.calculatedAmount.toString()),
        coefficient: parseFloat(fee.coefficient.toString()),
        description: fee.description,
        paymentBasis: fee.monthlyFee.paymentBasis,
        applicationMode: fee.monthlyFee.applicationMode,
      })),
      summary: {
        totalMonthlyAmount,
        totalPaid,
        totalOwed,
        balance: totalOwed - totalPaid,
      },
    };
  }

  async getBuildingApartmentFees(
    buildingId: string,
  ): Promise<IBuildingApartmentFeesResponse[]> {
    // Get all apartments in the building
    const apartments = await this.apartmentRepository.find({
      where: { buildingId },
      relations: ['residents'],
    });

    // Get all fees for each apartment
    const result: IBuildingApartmentFeesResponse[] = [];

    for (const apartment of apartments) {
      const paymentSummary = await this.getApartmentPaymentSummary(
        apartment.id,
      );

      // Get main resident info
      const mainResident: ResidentEntity | undefined =
        apartment.residents?.find((r: ResidentEntity) => r.isMainContact) ||
        apartment.residents?.[0];

      result.push({
        apartment: {
          id: apartment.id,
          number: apartment.number,
          floor: apartment.floor,
          residentsCount: apartment.residentsCount,
          status: apartment.status,
        },
        resident: mainResident
          ? {
              name: `${mainResident.name} ${mainResident.surname}`,
              isMainContact: mainResident.isMainContact,
            }
          : null,
        fees: paymentSummary.fees.map((fee) => ({
          ...fee,
          description: fee.description ?? null,
          paymentBasis: fee.paymentBasis.toString(),
          applicationMode: fee.applicationMode.toString(),
        })),
        summary: paymentSummary.summary,
      });
    }

    return result;
  }

  private calculateApartmentAmount(
    baseAmount: number,
    applicationMode: string,
    coefficient: number,
    allApartments: Array<{ coefficient: number; isSelected: boolean }>,
  ): number {
    const selectedApartments = allApartments.filter((apt) => apt.isSelected);

    if (applicationMode === 'monthly_fee') {
      // Each apartment pays the base amount multiplied by their coefficient
      return baseAmount * coefficient;
    } else {
      // Total amount is divided proportionally among selected apartments
      const totalCoefficients = selectedApartments.reduce(
        (sum, apt) => sum + apt.coefficient,
        0,
      );
      return (baseAmount * coefficient) / totalCoefficients;
    }
  }
}
