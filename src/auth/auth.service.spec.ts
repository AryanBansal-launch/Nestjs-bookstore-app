import { beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from '../auth/schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import  { Model } from 'mongoose';
import { LoginDTO } from './dto/login.dto';
import { signupDTO } from './dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import e from 'express';


describe('AuthService', () => {
  let authService: AuthService;
  let model: Model<User>;
  let jwtService: JwtService;

  const mockUser = {
    _id: '61c0ccf11d7bf83d153d7c06',
    name: 'Aryan',
    email: 'aryan1@gmail.com',
    password: 'hashedpassword',
  };

  const mockAuthService = {
    create: jest.fn().mockResolvedValue(mockUser), // ✅ Now returns password
    findOne: jest.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService,JwtService,{
        provide: getModelToken(User.name),
        useValue: mockAuthService,
      }],
    }).compile();

    //mocking the services that are injected in the AuthService
    authService = module.get<AuthService>(AuthService);
    model = module.get<Model<User>>(getModelToken(User.name));
    jwtService = module.get<JwtService>(JwtService);
  });

  //checking if the service is defined
  it('should be defined',()=>{
    expect(authService).toBeDefined();
  });

  //testing the signup function
  describe('signup', () => {

    //testing scenerio when user is created successfully
    it('should register a new user', async () => {
      jest.spyOn(bcrypt, 'hash').mockImplementation(async () => "hashedPassword"); 
      jest.spyOn(model, 'create').mockImplementationOnce(() => mockUser as any);
      jest.spyOn(jwtService, 'sign').mockImplementationOnce
      (() => 'token');
      const result = await authService.signUp(mockUser as unknown as signupDTO);
      expect(bcrypt.hash).toBeCalled();
      expect(result).toEqual({ token: 'token' });
    });

    //testing scenerio when duplicate user is found
    it('should throw an error if duplicate user is found', async () => {
      jest.spyOn(model, 'create').mockImplementationOnce(() => Promise.reject({code:11000}));
      await expect(authService.signUp(mockUser as unknown as signupDTO)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    const loginDTO={
      email:'aryan@gmail.com',
      password:'12345678'
    }
    //testing scenerio when user is found
    it('should login a user and return token', async () => {
      jest.spyOn(model,'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt,'compare').mockImplementationOnce(()=>true);
      jest.spyOn(jwtService,'sign').mockImplementationOnce
      (() => 'token');
      const result = await authService.login(loginDTO as unknown as LoginDTO);
      expect(bcrypt.compare).toBeCalled();
      expect(result).toEqual({ token: 'token' });
    });

    //testing scenerio when crdentials are incorrect
    it('should throw an error if user is not found', async () => {
      jest.spyOn(model,'findOne').mockResolvedValueOnce(null);
      await expect(authService.login(loginDTO as unknown as LoginDTO)).rejects.toThrow(UnauthorizedException);
    });

    //testing scenerio of incorrect email
    it('should throw an error if email is incorrect', async () => {
      jest.spyOn(model,'findOne').mockResolvedValueOnce(null);
      await expect(authService.login(loginDTO as unknown as LoginDTO)).rejects.toThrow(UnauthorizedException);
    });

    //testing scenerio when password is incorrect
    it('should throw an error if password is incorrect',async ()=>{
      jest.spyOn(model,'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt,'compare').mockImplementationOnce(()=>false);
      await expect(authService.login(loginDTO as unknown as LoginDTO)).rejects.toThrow(new Error('Invalid password'));
    })
  });
});
