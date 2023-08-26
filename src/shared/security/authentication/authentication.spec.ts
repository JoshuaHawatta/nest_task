import { Test, TestingModule } from '@nestjs/testing';
import AuthenticationController from './authentication.controller';
import AuthenticationService from './authentication.service';
import Role from '../../../enums/role.enum';
import SaveAccountDto from '../../../app/user/dtos/save-account.dto';
import CompanyRepository from '../../../app/company/repositories/company.repository';

const fakeRequestBody = {
  user: {
    name: 'fake123',
    email: 'fake@email.com',
    password: 'f4k_3',
    permission: Role.ADMIN,
  },
  permission: Role.ADMIN,
} as const;

const fakeRegisterResponse = {
  message: 'Olá, fake123',
  user: fakeRequestBody.user,
  token: 'abcd1234',
} as const;

describe('AuthenticationController', () => {
  let authenticationController: AuthenticationController;
  let authenticationService: AuthenticationService;
  let companyRepository: CompanyRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        {
          provide: AuthenticationService,
          useValue: {
            authenticate: jest.fn().mockReturnValue(fakeRegisterResponse.token),
            save: jest.fn().mockResolvedValue(fakeRequestBody.user),
            login: jest.fn(),
          },
        },
        {
          provide: CompanyRepository,
          useValue: {
            ensureCompanyExists: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    authenticationController = module.get<AuthenticationController>(
      AuthenticationController,
    );

    authenticationService = module.get<AuthenticationService>(
      AuthenticationService,
    );

    companyRepository = module.get<CompanyRepository>(CompanyRepository);
  });

  it('authentication controller, authentication service and company repository should be defined', () => {
    expect(authenticationController).toBeDefined();
    expect(authenticationService).toBeDefined();
    expect(companyRepository).toBeDefined();
  });

  describe('POST authentication/login', () => {
    it('should return a JWT when it succeeds', () => {
      const result = authenticationController.login(fakeRequestBody);

      expect(result).toEqual({ token: fakeRegisterResponse.token });
      expect(authenticationService.authenticate).toBeCalledTimes(1);
    });

    it('should throw an exception when it fails', async () => {
      jest
        .spyOn(authenticationService, 'authenticate')
        .mockImplementationOnce(() => {
          throw new Error('E-mail ou senha inválidos, tente novamente.');
        });

      try {
        authenticationController.login(fakeRequestBody);
      } catch (error) {
        expect(error.message).toBe(
          'E-mail ou senha inválidos, tente novamente.',
        );

        expect(authenticationService.authenticate).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('POST authentication/register', () => {
    it('should create a new user when it succeeds', async () => {
      const result = await authenticationController.register(
        new SaveAccountDto(fakeRegisterResponse.user),
      );

      expect(result).toEqual(fakeRegisterResponse);
      expect(authenticationService.save).toBeCalledTimes(1);
      expect(authenticationService.authenticate).toBeCalledTimes(1);
      expect(companyRepository.update).toBeCalledTimes(1);
    });

    it('should throw an exception when it fails', async () => {
      jest
        .spyOn(authenticationService, 'save')
        .mockRejectedValueOnce(new Error());

      expect(
        authenticationController.register(
          new SaveAccountDto(fakeRequestBody.user),
        ),
      ).rejects.toThrowError();

      expect(authenticationService.save).toBeCalledTimes(1);
    });
  });
});
