import { mock } from 'node:test';
import { beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from '../auth/schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { LoginDTO } from './dto/login.dto';
import { signupDTO } from './dto/signup.dto';
import { create } from 'domain';
import { find } from 'rxjs';


describe('AuthService', () => {
  let authService: AuthService;
  let model: Model<User>;

  const mockUser = {
    _id: '61c0ccf11d7bf83d153d7c06',
    name: 'Aryan',
    email: 'aryan1@gmail.com',
  };

  const mockAuthService = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
});
