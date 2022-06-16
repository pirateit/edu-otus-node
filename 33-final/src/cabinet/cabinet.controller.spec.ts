import { Test, TestingModule } from '@nestjs/testing';
import { CabinetController } from './cabinet.controller';

describe('CabinetController', () => {
  let controller: CabinetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CabinetController],
    }).compile();

    controller = module.get<CabinetController>(CabinetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
