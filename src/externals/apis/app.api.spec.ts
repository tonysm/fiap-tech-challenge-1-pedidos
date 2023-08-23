import { Test, TestingModule } from '@nestjs/testing';
import { AppAPI } from './app.api';

describe('AppController', () => {
  let appController: AppAPI;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppAPI],
      providers: [],
    }).compile();

    appController = app.get<AppAPI>(AppAPI);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
