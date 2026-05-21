import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { ZodValidationException } from 'nestjs-zod';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let httpAdapterHost: HttpAdapterHost;

  const mockHttpAdapter = {
    reply: jest.fn(),
  };

  const mockArgumentsHost = {
    switchToHttp: jest.fn().mockReturnThis(),
    getResponse: jest.fn().mockReturnThis(),
    getRequest: jest.fn().mockReturnThis(),
  };

  beforeEach(() => {
    httpAdapterHost = {
      httpAdapter: mockHttpAdapter as unknown as HttpAdapterHost['httpAdapter'],
    };
    filter = new AllExceptionsFilter(httpAdapterHost);
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should handle HttpException correctly', () => {
    const exception = new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    filter.catch(exception, mockArgumentsHost as unknown as ArgumentsHost);

    expect(mockHttpAdapter.reply).toHaveBeenCalledWith(
      expect.anything(),
      {
        success: false,
        message: 'Forbidden',
        errors: 'Forbidden',
      },
      HttpStatus.FORBIDDEN,
    );
  });

  it('should handle Generic Error correctly', () => {
    const exception = new Error('Database connection failed');
    filter.catch(exception, mockArgumentsHost as unknown as ArgumentsHost);

    expect(mockHttpAdapter.reply).toHaveBeenCalledWith(
      expect.anything(),
      {
        success: false,
        message: 'Internal server error',
        errors: 'Database connection failed',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  });

  it('should handle ZodValidationException correctly', () => {
    const zodErrors = [{ path: ['email'], message: 'Invalid email' }];
    const exception = {
      getStatus: () => HttpStatus.BAD_REQUEST,
      getResponse: () => ({ errors: zodErrors }),
    };

    Object.setPrototypeOf(exception, ZodValidationException.prototype);

    filter.catch(exception, mockArgumentsHost as unknown as ArgumentsHost);

    expect(mockHttpAdapter.reply).toHaveBeenCalledWith(
      expect.anything(),
      {
        success: false,
        message: 'Validation failed',
        errors: zodErrors,
      },
      HttpStatus.BAD_REQUEST,
    );
  });
});
