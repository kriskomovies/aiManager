import { Test, TestingModule } from '@nestjs/testing';
import { BuildingsController } from './buildings.controller';
import { BuildingsService } from './buildings.service';
import { BuildingRepository } from '../../database/repositories/building.repository';

describe('BuildingsController', () => {
  let controller: BuildingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BuildingsController],
      providers: [BuildingsService, BuildingRepository],
    }).compile();

    controller = module.get<BuildingsController>(BuildingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
