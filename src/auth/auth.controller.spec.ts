import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PassportModule } from '@nestjs/passport';
import { User } from 'src/auth/schemas/user.schema';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Role } from 'src/auth/enums/role.enum';

describe('AuthController', () => {

  //mocking the services/providers
  let authservice: AuthService;
  let authcontroller: AuthController;

  const mockUser = {
    _id: '61c0ccf11d7bf83d153d7c06',
    name: 'Ghulam',
    email: 'ghulam1@gmail.com',
  };

  let jwtToken='jwtToken';

  const mockAuthService = {
    signUp: jest.fn().mockResolvedValueOnce(jwtToken),
    login: jest.fn().mockResolvedValueOnce(jwtToken)
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authservice = module.get<AuthService>(AuthService);
    authcontroller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authcontroller).toBeDefined();
  });

  describe('signUp', () => {
    it('should register a new user', async () => {
      const signUpDto = {
        username: 'Ghulam',
        email: 'ghulam1@gmail.com',
        password: '12345678',
        role:[Role.User]
      };

      const result = await authcontroller.signUp(signUpDto);
      expect(authservice.signUp).toHaveBeenCalled();
      expect(result).toEqual(jwtToken);
    });
  });

  describe('login',()=>{
    it('should login a user',async ()=>{
      const loginDTO={
        email:"test@gmail.com",
        password:"12345678"
      }

      const result=await authcontroller.login(loginDTO);
      expect(authservice.login).toHaveBeenCalled();
      expect(result).toEqual(jwtToken);
    })
  })
});